'use client';

import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore'; 

export default function PendingEditListener() {
  // Yahan apne store ka wo function nikaal jo video add karta hai
  // (Note: addMedia ya jo bhi naam tune apni store.ts me rakha hai wo likhna)
  const addMediaAsset = useEditorStore((state) => state.addMediaAsset); 

  useEffect(() => {
    // 1. Check if there's a pending edit from Shorts Maker
    const pendingUrl = localStorage.getItem('seloice_pending_edit');
    
    if (pendingUrl) {
      console.log('Intercepted video from Shorts Maker!', pendingUrl);
      
      // 2. Add it to the editor timeline/store
      // Structure wahi pass karna jo tera store accept karta hai
      if (addMediaAsset) {
        addMediaAsset({
          id: `imported-${Date.now()}`,
          type: 'video',
          url: pendingUrl,
          blobUrl: pendingUrl,
          name: 'Imported Short Clip',
          mimeType: 'video/mp4',
          size: 1024 * 1024 * 10, // ~10MB dummy size
          createdAt: Date.now()
        });
      }

      // 3. Clear it so it doesn't keep loading on every refresh
      localStorage.removeItem('seloice_pending_edit');
    }
  }, [addMediaAsset]);

  // Ye component UI me kuch render nahi karega, sirf logic handle karega
  return null; 
}