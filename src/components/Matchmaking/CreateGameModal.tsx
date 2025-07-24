import { useState } from 'react';
import { createGame } from '@/services/game';
import { validateGame } from '@/services/validateGame';
import { useNavigate } from 'react-router-dom';

export default function CreateGameModal() {
  const [coinBet, setCoinBet] = useState(100);
  const [mode, setMode] = useState<'realtime' | 'async'>('realtime');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const game = await createGame(mode, coinBet, isPrivate);
      setSuccess('Partie créée avec succès ! Redirection...');
      setTimeout(() => {
        navigate(`/game/${game.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur inattendue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl max-w-lg mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Créer une partie</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mode de jeu</label>
          <div className="flex gap-4">
            <button
              className={\`px-4 py-2 rounded-lg font-semibold border \${mode === 'realtime' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}\`}
              onClick={() => setMode('realtime')}
            >
              ⏱ Temps réel
            </button>
            <button
              className={\`px-4 py-2 rounded-lg font-semibold border \${mode === 'async' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}\`}
              onClick={() => setMode('async')}
            >
              🕓 Asynchrone
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mise (coins)</label>
          <input
            type="number"
            min={10}
            max={1000}
            value={coinBet}
            onChange={(e) => setCoinBet(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <p className="text-xs text-gray-500 mt-1">+ 40 coins de frais seront ajoutés.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <label htmlFor="private" className="text-sm text-gray-700">Partie privée</label>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300"
        >
          {loading ? 'Création...' : 'Lancer la partie'}
        </button>

        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
        {success && <p className="text-green-600 text-center mt-2">{success}</p>}
      </div>
    </div>
  );
}