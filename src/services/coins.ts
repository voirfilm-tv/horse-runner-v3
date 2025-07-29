import { supabase } from '@/services/auth';
import { useUserStore } from '@/store/userStore';

/**
 * Récupère le nombre de coins de l'utilisateur connecté
 */
export async function getCoins(): Promise<number> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return 0;

  const { data, error } = await supabase
    .from('users')
    .select('coins')
    .eq('id', user.user.id)
    .single();

  if (error || !data) return 0;
  return data.coins;
}

/**
 * Vérifie si l'utilisateur a assez de coins pour un montant donné
 */
export async function canAfford(amount: number): Promise<boolean> {
  const coins = await getCoins();
  return coins >= amount;
}

/**
 * Ajoute des coins et met à jour Zustand
 */
export async function addCoins(amount: number): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return;

  await supabase.rpc('add_coins', {
    user_id_param: user.user.id,
    amount_param: amount,
  });

  await useUserStore.getState().fetchCoins();
}

/**
 * Retire des coins et met à jour Zustand
 */
export async function deductCoins(amount: number): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return;

  await supabase.rpc('deduct_coins', {
    user_id_param: user.user.id,
    amount_param: amount,
  });

  await useUserStore.getState().fetchCoins();
}