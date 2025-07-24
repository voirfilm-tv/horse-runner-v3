import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameBoard from '@/components/GameBoard/GameBoard';
import TurnManager from '@/components/GameBoard/TurnManager';
import CopyInviteLink from '@/components/GameBoard/CopyInviteLink';
import PlayerList from '@/components/PlayerList/PlayerList';
import CoinDisplay from '@/components/CoinDisplay/CoinDisplay';
import GameChat from '@/components/GameBoard/GameChat';
import { joinGame } from '@/services/game';

export default function Game() {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      joinGame(id).catch((err) => {
        console.error('Erreur lors de la connexion à la partie :', err.message);
      });
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center px-4 py-6">
      <CoinDisplay />

      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Partie en cours 🎮
        </h1>
        <CopyInviteLink />
        <PlayerList />
        <GameBoard />
        <TurnManager />
        <GameChat />
      </div>
    </div>
  );
}