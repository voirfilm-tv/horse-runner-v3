// src/pages/Game.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/database";  // adapte ce chemin à ton projet

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

      if (error) {
        console.error("Erreur chargement de la partie :", error.message);
        setGameData(null);
      } else {
        setGameData(data);
      }

      setLoading(false);
    };

    fetchGame();
  }, [gameId]);

  if (loading) return <div className="p-4 text-center">Chargement de la partie...</div>;
  if (!gameData) return <div className="p-4 text-center text-red-600">Partie introuvable.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Partie : {gameId}</h1>
      <pre>{JSON.stringify(gameData, null, 2)}</pre>
    </div>
  );
};

export default Game;
