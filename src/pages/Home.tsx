
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    console.log("🏠 Home page chargée");
  }, []);

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-green-700">Bienvenue sur Petits Chevaux Battle</h1>
    </div>
  );
}
