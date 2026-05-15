import { useEditorStore } from '../stores/editorStore';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class CanvasRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: BlobPart[] = [];
  private audioContext: AudioContext | null = null;
  private dest: MediaStreamAudioDestinationNode | null = null;
  private ffmpeg: FFmpeg | null = null;

  async loadFFmpeg() {
    if (this.ffmpeg) return;
    this.ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  async startExport(
    canvas: HTMLCanvasElement,
    onProgress: (progress: number, status: string) => void
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const store = useEditorStore.getState();
        store.pause();
        store.seek(0);
        
        onProgress(0, 'Initializing encoder...');
        this.recordedChunks = [];
        
        // Capture video stream from canvas
        // 60fps for smooth export if selected
        const fps = store.exportSettings.fps || 30;
        const videoStream = canvas.captureStream(fps);
        
        // Setup Web Audio API for audio mixing
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.dest = this.audioContext.createMediaStreamDestination();
        
        // Combine video and audio
        const tracks = [
          ...videoStream.getVideoTracks(),
          ...this.dest.stream.getAudioTracks()
        ];
        const combinedStream = new MediaStream(tracks);

        // Prepare MediaRecorder
        const options = {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: store.exportSettings.videoBitrate,
        };
        
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'video/webm;codecs=vp8';
        }

        this.mediaRecorder = new MediaRecorder(combinedStream, options);

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = async () => {
          onProgress(80, 'Processing final video...');
          const webmBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
          
          try {
            // Use FFmpeg to convert WebM to target format (MP4)
            await this.loadFFmpeg();
            const ffmpeg = this.ffmpeg!;
            
            ffmpeg.on('progress', ({ progress }) => {
              onProgress(80 + Math.round(progress * 15), 'Converting format...');
            });

            await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob));
            
            const outName = `output.${store.exportSettings.format}`;
            await ffmpeg.exec([
              '-i', 'input.webm',
              '-c:v', 'copy', // If exporting to webm. If mp4, we need to transcode or rely on browser support.
              // For simplicity, we transcode to h264 for mp4 compatibility
              ...(store.exportSettings.format === 'mp4' ? ['-c:v', 'libx264', '-preset', 'ultrafast'] : []),
              outName
            ]);
            
            const data = await ffmpeg.readFile(outName);
            const finalBlob = new Blob([data as any], { 
              type: store.exportSettings.format === 'mp4' ? 'video/mp4' : 'video/webm' 
            });
            
            onProgress(100, 'Complete!');
            resolve(URL.createObjectURL(finalBlob));
          } catch (error) {
            console.error('FFmpeg error:', error);
            // Fallback to webm if ffmpeg fails
            resolve(URL.createObjectURL(webmBlob));
          }
        };

        // Start playback and recording
        onProgress(5, 'Rendering frames...');
        this.mediaRecorder.start(100);
        store.play();

        // Monitor progress
        const checkInterval = setInterval(() => {
          const currentStore = useEditorStore.getState();
          const progress = (currentStore.currentTime / currentStore.duration) * 75;
          onProgress(5 + progress, 'Rendering frames...');
          
          if (currentStore.currentTime >= currentStore.duration || !currentStore.isPlaying) {
            clearInterval(checkInterval);
            store.pause();
            this.mediaRecorder?.stop();
            // Cleanup audio
            this.audioContext?.close();
          }
        }, 100);

      } catch (err) {
        reject(err);
      }
    });
  }
}

export const canvasRecorder = new CanvasRecorder();
