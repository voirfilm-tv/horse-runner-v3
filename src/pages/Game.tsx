
// src/pages/Game.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/database";
import { loadPlayers } from "@/services/game";
import { useGameStore } from "@/store/gameStore";
import GameBoard from "@/components/GameBoard/GameBoard";
import CoinDisplay from "@/components/CoinDisplay/CoinDisplay";

const Game = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (error || !data) {
        console.error("Erreur chargement de la partie :", error?.message);
        setGameData(null);
        setLoading(false);
        return;
      }

      setGameData(data);

      // Charge les joueurs
      const players = await loadPlayers(data.id);
      console.log("✅ Joueurs chargés :", players);
      useGameStore.getState().setPlayers(players);

      setLoading(false);
    };

    fetchGame();
  }, [gameId]);

  if (loading) return <div className="p-4 text-center">Chargement de la partie...</div>;
  if (!gameData) return <div className="p-4 text-center text-red-600">Partie introuvable.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6">
      <CoinDisplay />
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">🎮 Partie {gameId?.slice(0, 8)}...</h1>
        <p className="text-center text-gray-600 mb-4">
          Mode : <strong>{gameData.mode}</strong> · Mise : <strong>{gameData.bet} coins</strong>
        </p>

        <GameBoard />
      </div>
    </div>
  );
};

export default Game;
