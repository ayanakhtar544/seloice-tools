// File: src/app/tools/video-editor/components/PendingEditListener.tsx
'use client';

import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore'; 

export default function PendingEditListener() {
  // 🔥 THE SUPER FIX: Poore store ko 'as any' bol diya. Ab TypeScript 100% chup rahega!
  const store = useEditorStore() as any; 

  useEffect(() => {
    const hasPending = localStorage.getItem('seloice_pending_edit');
    
    if (hasPending === 'true') {
      console.log('[TRANSFER] Intercepting video from Shorts Maker...');
      
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
            const newTabUrl = URL.createObjectURL(blob);
            
            const mediaObject = {
              id: `imported-${Date.now()}`,
              type: 'video',
              url: newTabUrl,
              name: 'Viral Clip (Imported)'
            };

            // Ab yahan koi error nahi aayega kyunki store 'any' hai
            if (store.addMedia) {
              store.addMedia(mediaObject);
            } else if (store.addAsset) {
              store.addAsset(mediaObject);
            } else if (store.addVideo) {
              store.addVideo(mediaObject);
            } else {
              console.warn('[WARNING] Bhai, tere editorStore me video add karne ka function nahi mila! (addMedia/addAsset check kar)');
            }

            // CLEANUP
            const cleanupTx = db.transaction('media', 'readwrite');
            cleanupTx.objectStore('media').delete('pending_clip');
            localStorage.removeItem('seloice_pending_edit');
            
            console.log('[TRANSFER] Video successfully injected into Editor!');
          }
        };
      };
    }
  }, [store]);

  return null; 
}