import React from 'react';
import CreateGameModal from '../components/Modals/CreateGameModal';

const CreateGame: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center relative overflow-hidden p-6">
      {/* Fond de cercle stylisé */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="z-10 w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-green-700 text-center mb-6 drop-shadow-md">
          Créer une partie
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Défini ta mise, partage le lien, et invite tes amis à te rejoindre pour une partie de folie !
        </p>
        <CreateGameModal />
      </div>
    </div>
  );
};

export default CreateGame;
