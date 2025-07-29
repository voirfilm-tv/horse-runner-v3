import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type UserState = {
  userId: string | null;
  pseudo: string | null;
  coins: number;
  setUser: (userId: string, pseudo: string) => Promise<void>;
  fetchCoins: () => Promise<void>;
  setCoins: (coins: number) => Promise<void>;
  resetUser: () => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  userId: localStorage.getItem('userId'),
  pseudo: localStorage.getItem('pseudo'),
  coins: 0,

  setUser: async (userId, pseudo) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('pseudo', pseudo);
    const { data, error } = await supabase
      .from('users')
      .select('coins')
      .eq('id', userId)
      .single();

    if (!error && data) {
      set({ userId, pseudo, coins: data.coins });
    } else {
      console.error('Erreur récupération coins :', error);
      set({ userId, pseudo, coins: 0 });
    }
  },

  fetchCoins: async () => {
    const { userId } = get();
    if (!userId) return;

    const { data, error } = await supabase
      .from('users')
      .select('coins')
      .eq('id', userId)
      .single();

    if (!error && data) {
      set({ coins: data.coins });
    }
  },

  setCoins: async (coins) => {
    const { userId } = get();
    if (!userId) return;

    const { error } = await supabase
      .from('users')
      .update({ coins })
      .eq('id', userId);

    if (!error) {
      set({ coins });
    } else {
      console.error('Erreur mise à jour coins :', error);
    }
  },
  
updateCoins: async () => {
  const { userId } = get();
  if (!userId) return;

  const { data, error } = await supabase
    .from('users')
    .select('coins')
    .eq('id', userId)
    .single();

  if (!error && data) {
    set({ coins: data.coins });
  }
},

  resetUser: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('pseudo');
    set({ userId: null, pseudo: null, coins: 0 });
  },
}));
