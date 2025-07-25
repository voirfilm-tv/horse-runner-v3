import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/services/auth';
import { useUserStore } from '@/store/userStore';

interface Message {
  id: string;
  pseudo: string;
  message: string;
  created_at: string;
}

export default function GameChat() {
  const { id: gameId } = useParams();
  const pseudo = useUserStore((state) => state.pseudo);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!gameId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: true });
      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await supabase.from('chat_messages').insert({
      game_id: gameId,
      user_id: supabase.auth.getUser().data.user?.id,
      pseudo,
      message: input.trim(),
    });
    setInput('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-white border border-gray-300 rounded-xl shadow-md p-4">
      <div className="flex items-center gap-2 mb-3">
        <img src="/assets/icons/chat.png" alt="Chat" className="w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-700">💬 Chat de la partie</h2>
      </div>
      <div className="max-h-64 overflow-y-auto space-y-2 mb-3 text-sm text-gray-800">
        {messages.map((msg) => (
          <div key={msg.id}>
            <span className="font-bold">{msg.pseudo}:</span> {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Écrire un message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}