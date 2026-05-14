// File: src/lib/history.ts

export interface HistoryItem {
  id: string;
  toolSlug: string;
  toolName: string;
  actionDesc: string; // e.g. "Generated Titles for 'iPhone 15'"
  timestamp: number;
  outputData?: any; // To allow re-opening or displaying
}

const HISTORY_KEY = 'seloice_creator_history';

export const saveHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  if (typeof window === 'undefined') return;

  try {
    const existing = localStorage.getItem(HISTORY_KEY);
    let history: HistoryItem[] = existing ? JSON.parse(existing) : [];

    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };

    // Add to front, keep only last 20
    history = [newItem, ...history].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    // Dispatch custom event to update Drawer instantly
    window.dispatchEvent(new Event('history_updated'));
  } catch (err) {
    console.error('Failed to save history', err);
  }
};

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const existing = localStorage.getItem(HISTORY_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (err) {
    return [];
  }
};

export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event('history_updated'));
};
