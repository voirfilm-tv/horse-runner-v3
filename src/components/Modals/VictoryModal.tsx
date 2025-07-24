import { useEffect } from 'react';

interface Props {
  winner: string;
  onClose: () => void;
}

export default function VictoryModal({ winner, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center animate-bounce">
        <img src="/assets/images/ui/trophy.png" alt="Trophée" className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 Partie terminée !</h2>
        <p className="text-lg font-semibold text-gray-800">{winner} a gagné !</p>
        <p className="text-sm text-gray-500 mt-2">Fermeture automatique...</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Fermer maintenant
        </button>
      </div>
    </div>
  );
}