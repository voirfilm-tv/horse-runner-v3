import { useState } from 'react';

export default function Dice({ onRoll }: { onRoll: (value: number) => void }) {
  const [rolling, setRolling] = useState(false);
  const [value, setValue] = useState<number | null>(null);

  const rollDice = () => {
    setRolling(true);
    const result = Math.floor(Math.random() * 6) + 1;
    setTimeout(() => {
      setValue(result);
      setRolling(false);
      onRoll(result);
    }, 1000); // durée de l'animation
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <button
        onClick={rollDice}
        disabled={rolling}
        className="w-24 h-24 bg-white border-4 border-gray-700 rounded-2xl shadow-lg text-4xl font-bold flex items-center justify-center hover:bg-gray-100 transition"
      >
        {rolling ? '🎲' : value ?? '?'}
      </button>
      <p className="mt-2 text-sm text-gray-500">Lancer le dé</p>
    </div>
  );
}