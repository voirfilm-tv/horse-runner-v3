import { supabase } from '@/services/auth';
import { useGameStore } from '@/store/gameStore';

/**
 * Initialise une subscription en temps réel à une table de game state (ou games si simplifié)
 */
export function subscribeToGame(gameId: string) {
  return supabase
    .channel(`game-${gameId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        console.log('[Realtime] Update received:', payload);
        const newState = payload.new;

        if (newState && newState.players_state) {
          try {
            const parsed = JSON.parse(newState.players_state);
            const setPlayers = useGameStore.getState().setPlayers;
            setPlayers(parsed);
          } catch (err) {
            console.error('Erreur parsing players_state realtime:', err);
          }
        }
      }
    )
    .subscribe();
}

import { supabase } from '@/services/auth';
import { useGameStore } from '@/store/gameStore';

/**
 * Met à jour le champ players_state de la partie dans Supabase
 * Cela permet de propager les positions de tous les pions aux autres joueurs
 */
export async function syncGameState(gameId: string) {
  const players = useGameStore.getState().players;

  const { error } = await supabase
    .from('games')
    .update({ players_state: JSON.stringify(players) })
    .eq('id', gameId);

  if (error) {
    console.error('[syncGameState] Erreur mise à jour players_state:', error.message);
  }
}