import { useEffect } from 'react';
import { subscribeToGame } from '@/services/realtime';
import { syncGameState } from '@/services/realtime';

/**
 * Hook pour gérer automatiquement :
 * - la souscription realtime à une partie
 * - la synchronisation du gameState
 */
export function useGameSync(gameId: string) {
  useEffect(() => {
    const channel = subscribeToGame(gameId);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const updateState = () => {
    syncGameState(gameId);
  };

  return { updateState };
}