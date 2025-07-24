import { create } from 'zustand';

interface UIState {
  showChat: boolean;
  showDice: boolean;
  toggleChat: () => void;
  toggleDice: () => void;
  setShowChat: (value: boolean) => void;
  setShowDice: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  showChat: true,
  showDice: true,

  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  toggleDice: () => set((state) => ({ showDice: !state.showDice })),

  setShowChat: (value) => set({ showChat: value }),
  setShowDice: (value) => set({ showDice: value }),
}));