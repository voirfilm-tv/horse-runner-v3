import { useEffect, useState } from 'react';
import { supabase } from '@/services/auth';
import { useUserStore } from '@/store/userStore';

interface HistoryEntry {
  id: string;
  game_id: string;
  coins_won: number;
  result: string;
  played_at: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const pseudo = useUserStore((state) => state.pseudo);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false });

      if (!error && data) {
        setHistory(data);
      }

      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Historique de {pseudo}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500">Aucune partie enregistrée.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((entry) => (
              <li key={entry.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between">
                  <span className="text-gray-700">Partie : {entry.game_id.slice(0, 8)}...</span>
                  <span className={entry.result === 'win' ? 'text-green-600' : 'text-red-600'}>
                    {entry.result === 'win' ? '✅ Gagné' : '❌ Perdu'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Coins : {entry.coins_won} • {new Date(entry.played_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}