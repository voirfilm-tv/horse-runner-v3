
import { useGameStore } from '@/store/gameStore';
import { boardLayout } from '@/utils/board';

export default function GameBoard() {
  const { players } = useGameStore();

  console.log("🎯 Players reçus dans GameBoard :", players);
  console.log("🌴 GameBoard JUNGLE utilisé !");

  return (
    <div className="w-full flex justify-center items-center py-10 bg-gradient-to-br from-green-100 to-lime-200 rounded-xl shadow-inner border-4 border-green-400">
      <div className="relative aspect-square w-full max-w-[600px] grid grid-cols-15 grid-rows-15 gap-[2px] bg-green-700 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-lime-500">
        {boardLayout.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const bg =
              cell === 'start-red' ? 'bg-red-400' :
              cell === 'start-blue' ? 'bg-blue-400' :
              cell === 'start-green' ? 'bg-green-400' :
              cell === 'start-yellow' ? 'bg-yellow-400' :
              cell === 'safe' ? 'bg-emerald-200 animate-pulse' :
              cell === 'home' ? 'bg-green-300' :
              cell === 'path' ? 'bg-white' :
              cell === 'base-red' ? 'bg-red-100' :
              cell === 'base-blue' ? 'bg-blue-100' :
              cell === 'base-green' ? 'bg-green-100' :
              cell === 'base-yellow' ? 'bg-yellow-100' :
              'bg-lime-50';

            const pawn = players
              .flatMap((player, pIndex) =>
                player.pawns.map((pos, pawnIndex) => ({
                  ...pos,
                  playerColor: player.color,
                  key: `${pIndex}-${pawnIndex}`,
                }))
              )
              .find(p => p.x === colIndex && p.y === rowIndex);

            return (
              <div
                key={key}
                className={`${bg} w-full h-full relative flex items-center justify-center border border-green-800/20`}
              >
                {cell === 'safe' && <span className="text-green-700 text-sm font-bold">🌿</span>}
                {pawn && (
                  <>
                    <img
                      src={`/assets/images/pawns/pawn-${pawn.playerColor}.png`}
                      alt={`Pion ${pawn.playerColor}`}
                      className="w-5 h-5 z-10"
                    />
                    <div
                      className={\`w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-md border-2 border-white
                        \${pawn.playerColor === 'red' ? 'bg-red-600' :
                          pawn.playerColor === 'blue' ? 'bg-blue-600' :
                          pawn.playerColor === 'green' ? 'bg-green-600' :
                          pawn.playerColor === 'yellow' ? 'bg-yellow-500' : ''}\`}
                      title={pawn.key}
                    />
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

console.log("🌴 GameBoard JUNGLE utilisé !");

