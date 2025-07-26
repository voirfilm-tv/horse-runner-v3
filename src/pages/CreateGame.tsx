
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const CreateGame = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [pseudo, setPseudo] = useState<string | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [stake, setStake] = useState(100);
  const [mode, setMode] = useState<'realtime' | 'async'>('realtime');
  const [isPrivate, setIsPrivate] = useState(false);
  const [gameLink, setGameLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState(2);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('pseudo');
    if (!id) return setError("Utilisateur non connecté.");
    setUserId(id);
    setPseudo(name);
    fetchCoins(id);
  }, []);

  const fetchCoins = async (id: string) => {
    const { data, error } = await supabase.from('users').select('coins').eq('id', id).single();
    if (error) return setError("Impossible de récupérer les coins.");
    setCoins(data.coins);
  };

  const handleCreateGame = async () => {
    setLoading(true);
    setError(null);
    const totalCost = stake + 40;
    if (coins < totalCost) {
      setError("Pas assez de coins pour créer la partie.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from('games').insert({
      host_id: userId,
      stake,
      mode,
      private: isPrivate,
      players_required: players,
      players_state: [{ id: userId, pseudo, position: 0, color: 'red' }]
    }).select().single();

    if (error || !data) {
      setError("Erreur lors de la création de la partie.");
      setLoading(false);
      return;
    }

    // Mise à jour des coins utilisateur
    await supabase.from('users').update({ coins: coins - totalCost }).eq('id', userId);

    const link = `${window.location.origin}/jeu/${data.id}`;
    setGameLink(link);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-green-200 rounded-full opacity-30 blur-3xl top-[-100px] left-[-100px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-200 rounded-full opacity-30 blur-3xl bottom-[-80px] right-[-80px]" />
        <img src="/assets/images/ui/background.jpg" alt="background" className="absolute inset-0 w-full h-full object-cover opacity-5" />
      </div>

      <div className="relative z-10 bg-white bg-opacity-70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-4">Créer une partie</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Défini ta mise, partage le lien, et invite tes amis à te rejoindre pour une partie de folie !
        </p>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Mode de jeu</label>
          <div className="flex gap-4">
            <button onClick={() => setMode('realtime')} className={\`px-3 py-1 rounded-full text-sm border \${mode === 'realtime' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}\`}>⏱ Temps réel</button>
            <button onClick={() => setMode('async')} className={\`px-3 py-1 rounded-full text-sm border \${mode === 'async' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}\`}>🕓 Asynchrone</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Nombre de joueurs</label>
          <select value={players} onChange={(e) => setPlayers(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg">
            <option value={2}>2 joueurs</option>
            <option value={3}>3 joueurs</option>
            <option value={4}>4 joueurs</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Mise (coins)</label>
          <input type="number" value={stake} onChange={(e) => setStake(Number(e.target.value))} min={10} max={coins - 40} className="w-full px-3 py-2 border rounded-lg" />
          <p className="text-xs text-gray-500 mt-1">+ 40 coins de frais seront ajoutés.</p>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" id="private" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
          <label htmlFor="private" className="text-sm text-gray-700">Partie privée</label>
        </div>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {gameLink ? (
          <div className="text-center mt-4">
            <p className="text-green-700 font-semibold">✅ Partie créée !</p>
            <a href={gameLink} className="text-blue-600 underline break-all text-sm">{gameLink}</a>
          </div>
        ) : (
          <button onClick={handleCreateGame} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
            {loading ? 'Création...' : 'Lancer la partie'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateGame;
