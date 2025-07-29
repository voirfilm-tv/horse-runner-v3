import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';

const Admyn = () => {
  const [pseudo, setPseudo] = useState('');
  const [coins, setCoins] = useState<number>(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { fetchCoins } = useUserStore();
  const updateCoins = async () => {
    setSuccess('');
    setError('');

    const { data, error } = await supabase
      .from('users')
      .update({ coins })
      .eq('pseudo', pseudo);

    if (error) {
      console.error(error);
      setError("Erreur lors de la mise à jour.");
    } else if (data.length === 0) {
      setError("Aucun utilisateur trouvé avec ce pseudo.");
    } else {
      setSuccess("Coins mis à jour avec succès !");
      await fetchCoins(); //
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-6">
          🛠 Espace Admyn
        </h1>

        <label className="block mb-2 text-sm font-medium">Pseudo du joueur</label>
        <input
          type="text"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <label className="block mb-2 text-sm font-medium">Nouveau montant de coins</label>
        <input
          type="number"
          value={coins}
          onChange={(e) => setCoins(parseInt(e.target.value))}
          className="w-full mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={updateCoins}
          className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition"
        >
          💾 Modifier
        </button>

        {success && <p className="mt-4 text-green-600 text-sm">{success}</p>}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default Admyn;
