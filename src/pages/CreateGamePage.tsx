import CreateGameModal from '@/components/Matchmaking/CreateGameModal';

export default function CreateGamePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-green-200 px-4 py-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Créer une nouvelle partie 🎲
        </h1>
        <CreateGameModal />
      </div>
    </div>
  );
}