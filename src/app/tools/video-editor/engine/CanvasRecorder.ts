// File: src/app/tools/video-editor/engine/CanvasRecorder.ts
import { useEditorStore } from '../stores/editorStore';

class CanvasRecorder {
  async startExport(
    canvas: HTMLCanvasElement,
    onProgress: (progress: number, status: string) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const state = useEditorStore.getState();
        const { format, fps, videoBitrate } = state.exportSettings;
        const duration = state.duration || 5;

        // Save original playback states for post-export restoration
        const wasPlaying = state.isPlaying;
        const originalTime = state.currentTime;
        const wasMuted = state.isMuted;

        const chunks: Blob[] = [];
        const stream = canvas.captureStream(fps || 30);

        // Dynamic MIME type selection with robust fallback chains
        let mimeType = 'video/webm;codecs=vp9';
        if (format === 'mp4') {
          mimeType = MediaRecorder.isTypeSupported('video/mp4')
            ? 'video/mp4'
            : MediaRecorder.isTypeSupported('video/webm;codecs=h264')
            ? 'video/webm;codecs=h264'
            : 'video/webm';
        } else if (format === 'webm') {
          mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm';
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: mimeType,
          videoBitsPerSecond: (videoBitrate || 5000) * 1000, // Convert kbps to bps
        });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        // When recording stops, package blob, restore states, and resolve URL
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);

          // Perfect restoration of original player settings
          useEditorStore.setState({
            currentTime: originalTime,
            isMuted: wasMuted,
            isPlaying: wasPlaying,
          });

          if (wasPlaying) {
            useEditorStore.getState().play();
          } else {
            useEditorStore.getState().pause();
          }

          onProgress(100, 'Export Finished');
          resolve(url);
        };

        mediaRecorder.onerror = (err) => {
          cleanup();
          
          // Clean restoration on error
          useEditorStore.setState({
            currentTime: originalTime,
            isMuted: wasMuted,
            isPlaying: wasPlaying,
          });
          if (wasPlaying) {
            useEditorStore.getState().play();
          } else {
            useEditorStore.getState().pause();
          }

          reject(err);
        };

        // Prepare player state: Muted to prevent audible noise during background capture
        useEditorStore.setState({
          isMuted: true,
          currentTime: 0,
          isPlaying: true,
        });
        useEditorStore.getState().seek(0);
        useEditorStore.getState().play();

        onProgress(0, 'Initializing export...');
        mediaRecorder.start();

        // Monitor playback progress real-time and bind it to the export modal
        const intervalTime = 100;
        const timer = setInterval(() => {
          const currentState = useEditorStore.getState();
          const current = currentState.currentTime;
          const totalDur = currentState.duration || duration;

          const progress = Math.min((current / totalDur) * 99, 99);
          onProgress(progress, `Rendering frame: ${current.toFixed(1)}s / ${totalDur.toFixed(1)}s`);

          // Stop recording when we've captured the entire timeline
          if (current >= totalDur || !currentState.isPlaying) {
            cleanup();
            mediaRecorder.stop();
          }
        }, intervalTime);

        const cleanup = () => {
          clearInterval(timer);
        };

      } catch (err) {
        reject(err);
      }
    });
  }
}

export const canvasRecorder = new CanvasRecorder();