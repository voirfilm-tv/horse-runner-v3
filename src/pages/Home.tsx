import React from 'react';
import { useNavigate } from 'react-router-dom';
import CoinDisplay from '../components/CoinDisplay/CoinDisplay';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const pseudo = localStorage.getItem('pseudo');
  const coins = localStorage.getItem('coins');

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-white px-4"
      style={{
        backgroundImage: `url('/src/assets/images/ui/background.jpg')`,
      }}
    >
      <div className="bg-black/60 p-8 rounded-xl shadow-xl max-w-lg w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-yellow-300 drop-shadow">Bienvenue sur Petits Chevaux Battle</h1>

        <p className="text-lg text-gray-100">
          {pseudo ? `👋 Salut ${pseudo}, prêt à jouer ?` : 'Connecte-toi pour commencer !'}
        </p>

        <CoinDisplay />

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/creer')}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition-all"
          >
            🎮 Créer une partie
          </button>

          <button
            onClick={() => navigate('/lobby')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition-all"
          >
            🔍 Rejoindre une partie
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition-all"
          >
            🔒 Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
