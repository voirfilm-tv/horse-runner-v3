import { useGameStore } from '@/store/gameStore';
import Dice from '@/components/Dice/Dice';
import { movePawn, getDefaultPath, getCapturedPawn, checkVictory } from '@/utils/board';
import { useParams } from 'react-router-dom';
import { useGameSync } from '@/services/useGameSync';
import { useState } from 'react';
import { supabase } from '@/services/auth';
import { playSound } from '@/utils/sound';
import { handleCapture } from '@/services/handleCapture';
import VictoryModal from '@/components/Modals/VictoryModal';

export default function TurnManager() {
  const { players, currentTurn, nextTurn, updatePawn } = useGameStore();
  const { id: gameId } = useParams();
  const { updateState } = useGameSync(gameId || '');
  const [winner, setWinner] = useState<string | null>(null);

  const activePlayer = players[currentTurn];
  const path = getDefaultPath();

  const handleRoll = async (value: number) => {
    const currentPos = activePlayer.pawns[0];
    const currentIndex = path.findIndex(p => p.x === currentPos.x && p.y === currentPos.y);
    const newPos = movePawn(path, currentIndex, value);

    const allPawns = players.flatMap((player, pIndex) =>
      player.pawns.map((pos, pawnIndex) => ({
        pos,
        playerIndex: pIndex,
        pawnIndex,
        color: player.color,
      }))
    );

    const captured = getCapturedPawn(newPos, allPawns, currentTurn);

    if (captured) {
      playSound('capture');
      handleCapture(game.id, captured.id);
      updatePawn(captured.playerIndex, captured.pawnIndex, { x: 0, y: 0 });
    }

    updatePawn(currentTurn, 0, newPos);

    // Vérifie victoire
    const updatedPawns = [...activePlayer.pawns];
    updatedPawns[0] = newPos;
    if (checkVictory(updatedPawns)) {
      setWinner(activePlayer.pseudo);
      playSound('victory');
      const winnerId = activePlayer.id;
      await logVictory(gameId, winnerId, players);
      updateState();

      if (gameId) {
        await supabase
          .from('games')
          .update({ status: 'finished' })
          .eq('id', gameId);
      }
      return;
    }

    updateState();

    setTimeout(() => {
      nextTurn();
      updateState();
    }, 1000);
  };

  return (
    <div className="mt-8 text-center">
      {winner && <VictoryModal winner={winner} onClose={() => setWinner(null)} />}

      {winner ? (
        <div className="text-2xl font-bold text-green-700">
          🎉 {winner} a gagné la partie !
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Tour de : <span className="text-indigo-600">{activePlayer.pseudo}</span>
          </h2>
          <Dice onRoll={handleRoll} />
        </>
      )}
    </div>
  );
}