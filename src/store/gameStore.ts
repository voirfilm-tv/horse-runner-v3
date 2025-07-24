import { create } from 'zustand';
import type { Coord } from '@/utils/board';

interface Player {
  id: string;
  pseudo: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
  pawns: Coord[]; // positions des pions
}

interface GameState {
  players: Player[];
  currentTurn: number; // index du joueur courant
  setPlayers: (players: Player[]) => void;
  nextTurn: () => void;
  updatePawn: (playerIndex: number, pawnIndex: number, newCoord: Coord) => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  currentTurn: 0,

  setPlayers: (players) => set({ players }),

  nextTurn: () =>
    set((state) => ({
      currentTurn: (state.currentTurn + 1) % state.players.length,
    })),

  updatePawn: (playerIndex, pawnIndex, newCoord) =>
    set((state) => {
      const playersCopy = [...state.players];
      const pawnsCopy = [...playersCopy[playerIndex].pawns];
      pawnsCopy[pawnIndex] = newCoord;
      playersCopy[playerIndex] = {
        ...playersCopy[playerIndex],
        pawns: pawnsCopy,
      };
      return { players: playersCopy };
    }),
}));