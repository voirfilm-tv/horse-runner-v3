import { useEffect, useState } from 'react';
import {
  getFriends,
  getPendingRequests,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from '@/services/friends';

export default function Friends() {
  const [friends, setFriends] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [pseudo, setPseudo] = useState('');
  const [message, setMessage] = useState('');

  const loadAll = async () => {
    try {
      const [f, p] = await Promise.all([getFriends(), getPendingRequests()]);
      setFriends(f);
      setPending(p);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAdd = async () => {
    try {
      await sendFriendRequest(pseudo);
      setMessage('✅ Demande envoyée à ' + pseudo);
      setPseudo('');
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    }
  };

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id);
    await loadAll();
  };

  const handleRemove = async (id: string) => {
    await removeFriend(id);
    await loadAll();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <img src="/assets/icons/friends.png" alt="Amis" className="w-6 h-6" />
          <h1 className="text-2xl font-bold text-purple-700">👥 Mes amis</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ajouter un ami :</h2>
          <div className="flex gap-2">
            <input
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Pseudo"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              ➕ Ajouter
            </button>
          </div>
          {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Demandes reçues :</h2>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune demande pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {pending.map((req) => (
                <li key={req.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                  <span>{req.sender.pseudo}</span>
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    ✅ Accepter
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Mes amis :</h2>
          {friends.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun ami pour le moment.</p>
          ) : (
            <ul className="space-y-2">
              {friends.map((friend) => (
                <li key={friend.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                  <span>{friend.friend.pseudo}</span>
                  <button
                    onClick={() => handleRemove(friend.friend_id)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    🗑️ Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}