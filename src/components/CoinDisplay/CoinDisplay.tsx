import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';

export default function CoinDisplay() {
  const { pseudo, coins } = useUserStore();
  const [animate, setAnimate] = useState(false);
  const [previous, setPrevious] = useState(coins);

  useEffect(() => {
    if (coins > previous) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
    }
    setPrevious(coins);
  }, [coins]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
      <span className="text-sm font-medium">👤 {pseudo}</span>
      <span
        className={`text-sm font-semibold transition-all duration-500 ${animate ? 'scale-125 text-green-600' : ''}`}
      >
        🪙 {coins} coins
      </span>
    </div>
  );
}