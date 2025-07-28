import { supabase } from './supabase';

export async function getCoins(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('users')
    .select('coins')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Erreur récupération coins:', error);
    return 0;
  }

  return data.coins;
}

export async function updateCoins(userId: string, amount: number) {
  const { error } = await supabase
    .from('users')
    .update({ coins: amount })
    .eq('id', userId);

  if (error) {
    console.error('Erreur mise à jour coins:', error);
  }
}
