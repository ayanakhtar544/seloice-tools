// File: src/lib/history.ts

export interface HistoryItem {
  id: string;
  toolName: string;
  toolSlug: string;
  actionDesc: string;
  timestamp: number;
  [key: string]: any; // Allow any custom data properties like outputData
}

export interface AddHistoryInput {
  toolName: string;
  toolSlug: string;
  actionDesc: string;
  [key: string]: any;
}

const HISTORY_KEY = 'seloice_user_history';
const MAX_HISTORY_ITEMS = 50; // 50 se zyada save nahi karenge taaki storage na bhare

// 🚀 Get History
export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

// 🚀 Add New History (Tools me use karne ke liye)
export const addHistory = (item: AddHistoryInput) => {
  if (typeof window === 'undefined') return;
  
  const currentHistory = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
  };

  const updatedHistory = [newItem, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

  // 🔥 MAIN JADOO: Ye event drawer ko bolega ki UI update karo!
  window.dispatchEvent(new Event('history_updated'));
};

// 🚀 Compatibility Alias for saveHistory (Fix for tools importing saveHistory)
export const saveHistory = addHistory;

// 🚀 Clear History
export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event('history_updated'));
};