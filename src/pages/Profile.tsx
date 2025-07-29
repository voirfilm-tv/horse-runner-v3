import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { playSound } from '@/utils/sound';
import { grantDailyBonus } from '@/services/coins';

export default function Profile() {
  const { pseudo, coins } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <img src="/assets/icons/user.png" alt="Utilisateur" className="w-12 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-blue-700 mb-4">👤 Mon profil</h1>
        <p className="text-lg text-gray-800 mb-2">Pseudo : <strong>{pseudo}</strong></p>
        <p className="text-lg text-gray-800 mb-6">Coins : <strong>{coins}</strong></p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/friends')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            👫 Gérer mes amis
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            📊 Voir mes parties
          </button>
          <button
            onClick={() => navigate('/lobby')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            🎮 Rejoindre une partie
          </button>
        
          <button
            onClick={() => alert('Fonctionnalité à venir')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition flex items-center justify-center gap-2"
          >
            <img src="/assets/icons/setting.png" alt="Paramètres" className="w-4 h-4" />
            Paramètres
          </button>
          
    <button>
  onClick={async () => {
    const updated = await updateCoins(coins + 500);
    setCoins(updated);
    alert('500 coins ajoutés');
  }}
  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
>
  💰 Ajouter 500 coins
</button>

        </div>
      </div>
    </div>
  );
}
