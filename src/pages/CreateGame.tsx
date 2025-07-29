import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';
import { useUserStore } from '@/store/userStore';
import { updateCoins } from '@/services/coins';

const CreateGame = () => {
  const [mode, setMode] = useState<'realtime' | 'async'>('realtime');
  const [bet, setBet] = useState(100);
  const [playerCount, setPlayerCount] = useState(2);
  const [error, setError] = useState('');
  const [gameLink, setGameLink] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = useUserStore(state => state.userId);
  const pseudo = useUserStore(state => state.pseudo);
  const coins = useUserStore(state => state.coins);
  const navigate = useNavigate();

  const totalCost = bet + 40;

  const handleCreate = async () => {
    if (!userId) {
      setError("Vous devez être connecté pour créer une partie.");
      return;
    }
    if (coins < totalCost) {
      setError("Solde insuffisant pour créer cette partie.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.from('games').insert([{
        host_id: userId,
        mode,
        bet,
        player_count: playerCount
      }]).select().single();

      if (error) throw error;

      setGameLink(`${window.location.origin}/lobby/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la partie.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("Utilisateur non connecté.");
    } else {
    updateCoins(); // ✅ Refresh coins depuis Supabase
  }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-green-100 p-6 flex flex-col justify-center items-center text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🎲 Créer une partie</h1>
        <p className="mb-6 text-gray-700">Défini ta mise, choisis le mode de jeu et invite tes amis !</p>

        <div className="text-left space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mode de jeu</label>
            <div className="flex gap-4">
              <button onClick={() => setMode('realtime')} className={`px-3 py-1 rounded-full text-sm border ${mode === 'realtime' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}>⏱ Temps réel</button>
              <button onClick={() => setMode('async')} className={`px-3 py-1 rounded-full text-sm border ${mode === 'async' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}>🕓 Asynchrone</button>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nombre de joueurs</label>
            <select value={playerCount} onChange={e => setPlayerCount(Number(e.target.value))} className="w-full border rounded px-3 py-2 text-sm">
              {[2, 3, 4].map(n => <option key={n} value={n}>{n} joueurs</option>)}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mise (coins)</label>
            <input type="number" value={bet} onChange={e => setBet(Number(e.target.value))} className="w-full border rounded px-3 py-2 text-sm" min={10} />
            <p className="text-xs text-gray-500 mt-1">+ 40 coins de frais seront ajoutés.</p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button onClick={handleCreate} disabled={loading} className="w-full mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            {loading ? 'Création...' : '🚀 Lancer la partie'}
          </button>

          {gameLink && (
            <div className="mt-4 text-center text-green-600 font-medium">
              🎉 Partie créée ! Invite tes amis avec ce lien :
              <br />
              <code className="bg-white px-2 py-1 rounded text-sm">{gameLink}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
