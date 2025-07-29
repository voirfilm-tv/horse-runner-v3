import { useEffect, useState } from 'react';
import { listPublicGames, autoJoinOrCreate } from '@/services/game';
import { useNavigate } from 'react-router-dom';
import { playSound } from '@/utils/sound';
import CoinDisplay from '@/components/CoinDisplay/CoinDisplay';
import { useUserStore } from '@/store/userStore';
import { updateCoins } from '@/utils/coins';

interface Game {
  id: string;
  mode: string;
  coin_bet: number;
  created_at: string;
}

export default function Lobby() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchmakingLoading, setMatchmakingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
     updateCoins(); //
    async function fetchGames() {
      setLoading(true);
      const results = await listPublicGames();
      setGames(results);
      setLoading(false);
    }
    fetchGames();
  }, []);

  const handleMatchmaking = async () => {
    setMatchmakingLoading(true);
    try {
      const id = await autoJoinOrCreate();
      playSound('join');
      navigate('/game/' + id);
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setMatchmakingLoading(false);
    }
  };

  return (
    <>
      <CoinDisplay />
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
          <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
            Lobby Public 🌍
          </h1>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button
              onClick={handleMatchmaking}
              disabled={matchmakingLoading}
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              {matchmakingLoading ? 'Recherche...' : '🎲 Trouver une partie'}
            </button>
            <button
              onClick={() => navigate('/create')}
              className="px-5 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              ➕ Créer une partie
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Chargement des parties...</p>
          ) : games.length === 0 ? (
            <p className="text-center text-gray-500">Aucune partie disponible pour l’instant.</p>
          ) : (
            <div className="space-y-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 shadow-sm"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      Mode : {game.mode === 'realtime' ? 'Temps réel' : 'Asynchrone'}
                    </p>
                    <p className="text-sm text-gray-500">Mise : {game.coin_bet} coins</p>
                  </div>
                  <button
                    onClick={() => navigate('/game/' + game.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    🎮 Rejoindre
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
