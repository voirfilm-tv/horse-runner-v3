import { supabase } from './supabase';

export const addCoins = async (userId: string, amount: number) => {
  const { data, error } = await supabase.rpc('increment_coins', {
    user_id_input: userId,
    coins_to_add: amount,
  });
  if (error) throw error;
  return data;
};

export const getCoins = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('coins')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data.coins;
};
