import { create } from 'zustand';

interface UserState {
  pseudo: string | null;
  coins: number;
  setUser: (pseudo: string, coins: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  pseudo: null,
  coins: 0,

  setUser: (pseudo, coins) => set({ pseudo, coins }),
  clearUser: () => set({ pseudo: null, coins: 0 }),
}));