import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [pseudo, setPseudo] = useState('');
  const [coins, setCoins] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPseudo = localStorage.getItem('pseudo');
    const storedCoins = localStorage.getItem('coins');

    if (!storedPseudo || !storedCoins) {
      navigate('/login');
    } else {
      setPseudo(storedPseudo);
      setCoins(Number(storedCoins));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/assets/images/background-bg.png')` }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
          Bienvenue sur Horse runner 🐴
        </h1>

        <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md text-center space-y-4">
          <p className="text-lg">👤 <strong>{pseudo}</strong></p>
          <p className="text-lg">🪙 <strong>{coins}</strong> coins</p>

          <button
            onClick={() => navigate('/create')}
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            🎮 Créer une partie
          </button>

          <button
            onClick={() => navigate('/join')}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            🔗 Rejoindre une partie
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-400 text-white rounded-lg hover:bg-red-500"
          >
            🚪 Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
