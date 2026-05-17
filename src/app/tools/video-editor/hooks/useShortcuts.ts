// File: src/app/tools/video-editor/hooks/useShortcuts.ts
import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';

export function useShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 🔥 IMPORTANT: Agar user kisi input box me text (Caption/Title) type kar raha hai, 
      // toh shortcuts trigger nahi hone chahiye!
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const state = useEditorStore.getState();

      switch (e.key.toLowerCase()) {
        case ' ': // Spacebar
          e.preventDefault(); // Browser ko page niche scroll karne se rokna
          state.togglePlay();
          break;
          
        case 's': // Split
          if (state.selectedClipIds.length > 0) {
            e.preventDefault();
            state.selectedClipIds.forEach(id => state.splitClip(id, state.currentTime));
          }
          break;
          
        case 'delete':
        case 'backspace': // Delete Clip
          if (state.selectedClipIds.length > 0) {
            e.preventDefault();
            state.selectedClipIds.forEach(id => state.removeClip(id));
          }
          break;
          
        case 'z': // Undo / Redo
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.shiftKey) {
              state.redo();
            } else {
              state.undo();
            }
          }
          break;
          
        case 'y': // Redo (Windows Style)
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            state.redo();
          }
          break;
          
        case 'c': // Duplicate
          if ((e.ctrlKey || e.metaKey) && state.selectedClipIds.length > 0) {
            e.preventDefault();
            state.selectedClipIds.forEach(id => state.duplicateClip(id));
          }
          break;
          
        case 'arrowleft': // Step Backward
          e.preventDefault();
          state.stepBackward();
          break;
          
        case 'arrowright': // Step Forward
          e.preventDefault();
          state.stepForward();
          break;
          
        case 'f': // Fullscreen
          e.preventDefault();
          state.toggleFullScreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}