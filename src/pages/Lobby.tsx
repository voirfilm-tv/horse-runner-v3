import { useEffect, useState } from 'react';
import { listPublicGames, joinPrivateGame } from '@/services/game';
import { useNavigate, useParams } from 'react-router-dom';
import { playSound } from '@/utils/sound';
import CoinDisplay from '@/components/CoinDisplay/CoinDisplay';
import { updateCoins } from '@/utils/coins';

interface Game {
  id: string;
  mode: string;
  coin_bet: number;
  created_at: string;
}

export default function Lobby() {
  const { gameId } = useParams(); // récupère le paramètre d'URL (si présent)
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchmakingLoading, setMatchmakingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateCoins(); // met à jour les coins

    if (gameId) {
      // Si un gameId est présent dans l'URL → tentative de rejoindre partie privée
      async function joinPrivate() {
        try {
          await joinPrivateGame(gameId); // optionnel si tu veux valider côté backend
          playSound('join');
          navigate('/game/' + gameId); // redirige vers la partie
        } catch (err: any) {
          console.error('Erreur en rejoignant la partie privée :', err.message);
          alert("Impossible de rejoindre cette partie.");
          navigate('/lobby'); // revient au lobby classique
        }
      }
      joinPrivate();
      return;
    }

    // Sinon, chargement classique du lobby public
    async function fetchGames() {
      setLoading(true);
      const results = await listPublicGames();
      setGames(results);
      setLoading(false);
    }
    fetchGames();
  }, [gameId]);

  if (gameId) {
    // Si on est en train de traiter une partie privée, pas d'affichage UI
    return <p className="p-6 text-center">Connexion à la partie privée...</p>;
  }

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
              onClick={async () => {
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
              }}
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
