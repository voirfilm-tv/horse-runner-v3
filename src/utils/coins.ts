import { supabase } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

export async function getCoins(): Promise<number> {
  const userId = getUserId();
  if (!userId) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase
    .from('users')
    .select('coins')
    .eq('id', userId)
    .single();

  if (error || !data) throw new Error('Impossible de récupérer les coins');

  return data.coins;
}

export async function updateCoins(amount: number): Promise<number> {
  const userId = getUserId();
  if (!userId) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase
    .from('users')
    .update({ coins: amount })
    .eq('id', userId)
    .select('coins')
    .single();

  if (error || !data) throw new Error('Erreur mise à jour coins');

  return data.coins;
}
