import { supabase } from '@/services/auth';

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
 * Ajoute des coins au joueur
 */
export async function addCoins(amount: number): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return;

  await supabase.rpc('add_coins', {
    user_id_param: user.user.id,
    amount_param: amount,
  });
}

/**
 * Retire des coins au joueur
 */
export async function deductCoins(amount: number): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return;

  await supabase.rpc('deduct_coins', {
    user_id_param: user.user.id,
    amount_param: amount,
  });
}

/**
 * Ajoute le bonus quotidien de 50 coins si non déjà reçu aujourd'hui
 */
export async function grantDailyBonus(): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return false;

  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('users')
    .select('last_bonus')
    .eq('id', user.user.id)
    .single();

  if (error || !data) return false;

  const last = data.last_bonus?.split('T')[0];
  if (last === today) return false;

  const { error: updateError } = await supabase
    .from('users')
    .update({ coins: data.coins + 50, last_bonus: new Date().toISOString() })
    .eq('id', user.user.id);

  return !updateError;
}