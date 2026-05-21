// File: src/app/tools/video-editor/components/PendingEditListener.tsx
'use client';

import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore'; 

export default function PendingEditListener() {
  const store = useEditorStore(); 

  useEffect(() => {
    const hasPending = localStorage.getItem('seloice_pending_edit');
    
    if (hasPending === 'true') {
      console.log('[TRANSFER] Intercepting video. Synchronizing preview engine geometry...');
      
      const request = indexedDB.open('SeloiceTransferDB', 1);
      
      request.onupgradeneeded = (e: any) => {
        e.target.result.createObjectStore('media');
      };

      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction('media', 'readonly');
        const storeDB = tx.objectStore('media');
        const getReq = storeDB.get('pending_clip');

        getReq.onsuccess = () => {
          const blob = getReq.result;
          if (blob) {
            // 🔥 Prevent double-firing (Hot reload cleanup)
            localStorage.removeItem('seloice_pending_edit');

            // IMPORTANT: Stable Blob URL
            const newTabUrl = URL.createObjectURL(blob);
            const mediaId = `imported_faceless_${Date.now()}`;
            
            // 🔥 STEP 1: RESTORE GEOMETRY (Invisible temp video)
            const tempVideo = document.createElement('video');
            tempVideo.src = newTabUrl;
            tempVideo.preload = 'metadata'; // Hint to browser

            tempVideo.onloadedmetadata = () => {
              const duration = tempVideo.duration || 30;
              const width = tempVideo.videoWidth || 720;
              const height = tempVideo.videoHeight || 1280;

              console.log(`[GEO-FOUND] ${width}x${height} @ ${duration}s. Fusing to canvas engine...`);

              // 🔥 STEP 2: CLEAR ALL PREVIOUS STATE (Prevent canvas conflicts)
              store.reset(); 

              // 🔥 STEP 3: AUTOMATIC ASPECT RATIO SETUP (CRUCIAL FIX)
              // Determines the default view size for the canvas player.
              // If this doesn't match the video, the video is rendered invisible.
              let projectRatio = '9:16';
              if (width > height) projectRatio = '16:9';
              if (width === height) projectRatio = '1:1';

              console.log(`[PROJECT-SETUP] Setting Aspect Ratio to: ${projectRatio}`);
              
              store.setProject({
                  name: `Faceless Maker - ${new Date().toLocaleTimeString()}`,
                  aspectRatio: projectRatio as any,
                  createdAt: Date.now(),
                  updatedAt: Date.now()
              });

              // 🔥 STEP 4: Inject Media Asset with correct dimensions
              const mediaObject = {
                id: mediaId,
                type: 'video',
                name: 'Faceless Maker Source',
                url: newTabUrl,
                blobUrl: newTabUrl, 
                blob: blob,
                duration: duration,
                width: width,
                height: height,
                size: blob.size,
                createdAt: Date.now()
              };
              store.addMediaAsset(mediaObject as any);

              // 🔥 STEP 5: Create fresh track layer
              const trackId = store.addTrack('video', 'AI Generated Video');

              // 🔥 STEP 6: Inject Clip with strictly defined geometry for the preview engine
              store.addClip({
                trackId: trackId,
                mediaId: mediaId,
                type: 'video',
                startTime: 0,
                endTime: duration,
                trimStart: 0,
                trimEnd: duration, // The preview engine bounding box
                speed: 1,
                volume: 1,
                visible: true, // Force visibility flag
                name: 'Main Clip'
              } as any); 

              // 🔥 STEP 7: FORCE CANVAS RENDER ENGINE REFRESH
              // Browser ko state load karne me time lagta hai. 
              // Hum nudge karenge player DOM ko frame render karne ke liye.
              console.log('[TRANSFER] Nudging render engine for first frame...');
              setTimeout(() => {
                store.seek(0.1); // Seek halka sa aage
                setTimeout(() => {
                    store.seek(0); // Seek wapas back
                    store.recalculateDuration(); // Sync timeline bar
                    console.log('[TRANSFER-DONE] Preview should be active now.');
                }, 100);
              }, 300);
            };

            // Remove from IndexedDB 
            const cleanupTx = db.transaction('media', 'readwrite');
            cleanupTx.objectStore('media').delete('pending_clip');
          }
        };
      };
    }
  }, [store]);

  return null; 
}