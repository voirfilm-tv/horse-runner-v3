// 📁 src/services/coins.ts

import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';

/**
 * Récupère le solde de coins depuis la base Supabase
 * et met à jour le store Zustand en conséquence.
 */
export const updateCoins = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  const { data, error } = await supabase
    .from('users')
    .select('coins')
    .eq('id', userId)
    .single();

  if (!error && data) {
    useUserStore.getState().setCoins(data.coins);
    console.log('🪙 Coins mis à jour :', data.coins);
  } else {
    console.error('❌ Erreur mise à jour coins :', error);
  }
};

/**
 * Décrémente les coins de l'utilisateur après une mise.
 * @param amount Montant à retirer
 */
export const deductCoins = async (amount: number) => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  const { data, error } = await supabase
    .rpc('deduct_user_coins', { uid: userId, amount });

  if (error) {
    console.error('❌ Erreur déduction coins :', error);
    return false;
  }

  useUserStore.getState().setCoins(data?.new_balance || 0);
  console.log('🧾 Nouveau solde :', data?.new_balance);
  return true;
};

/**
 * Crédite un nombre de coins à l'utilisateur.
 * @param amount Montant à ajouter
 */
export const addCoins = async (amount: number) => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  const { data, error } = await supabase
    .from('users')
    .update({ coins: supabase.raw(`coins + ${amount}`) })
    .eq('id', userId)
    .select('coins')
    .single();

  if (!error && data) {
    useUserStore.getState().setCoins(data.coins);
    console.log('💰 Coins ajoutés :', data.coins);
  } else {
    console.error('❌ Erreur ajout coins :', error);
  }
};
