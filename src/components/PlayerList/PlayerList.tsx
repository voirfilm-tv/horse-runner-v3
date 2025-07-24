import { useGameStore } from '@/store/gameStore';

export default function PlayerList() {
  const { players, currentTurn } = useGameStore();

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-white border border-gray-300 rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">👥 Joueurs</h2>
      <ul className="space-y-2 text-sm">
        {players.map((player, index) => (
          <li
            key={player.id}
            className={\`flex justify-between items-center px-3 py-2 rounded-lg
              \${index === currentTurn ? 'bg-green-100 font-bold text-green-700' : 'bg-gray-50'}\`}
          >
            <span>
              {player.pseudo} ({player.color})
            </span>
            <span>{player.pawns.length} pions</span>
          </li>
        ))}
      </ul>
    </div>
  );
}