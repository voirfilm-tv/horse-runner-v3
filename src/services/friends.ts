import { supabase } from '@/services/auth';

/**
 * Envoie une demande d'ami à un utilisateur par pseudo
 */
export async function sendFriendRequest(pseudo: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('Utilisateur non connecté');

  const { data: targetUser, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('pseudo', pseudo)
    .single();

  if (userError || !targetUser) throw new Error('Utilisateur introuvable');
  if (targetUser.id === user.user.id) throw new Error('Tu ne peux pas t’ajouter toi-même');

  const { error } = await supabase.from('friends').insert({
    user_id: user.user.id,
    friend_id: targetUser.id,
    status: 'pending',
  });

  if (error) throw error;
}

/**
 * Accepte une demande d'ami en attente
 */
export async function acceptFriendRequest(requestId: string) {
  const { error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('id', requestId);

  if (error) throw error;
}

/**
 * Supprime un ami ou une demande d’amitié (dans les deux sens)
 */
export async function removeFriend(friendId: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error('Utilisateur non connecté');

  const { error } = await supabase
    .from('friends')
    .delete()
    .or(
      `and(user_id.eq.${user.user.id},friend_id.eq.${friendId}),
         and(user_id.eq.${friendId},friend_id.eq.${user.user.id})`
    );

  if (error) throw error;
}

/**
 * Récupère les amis confirmés de l’utilisateur
 */
export async function getFriends() {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return [];

  const { data, error } = await supabase
    .from('friends')
    .select('id, friend_id, status, friend:friend_id (pseudo)')
    .eq('user_id', user.user.id)
    .eq('status', 'accepted');

  if (error) throw error;
  return data || [];
}

/**
 * Récupère les demandes d’amis reçues en attente
 */
export async function getPendingRequests() {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return [];

  const { data, error } = await supabase
    .from('friends')
    .select('id, user_id, status, sender:user_id (pseudo)')
    .eq('friend_id', user.user.id)
    .eq('status', 'pending');

  if (error) throw error;
  return data || [];
}