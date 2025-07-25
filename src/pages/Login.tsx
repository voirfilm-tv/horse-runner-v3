import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export default function Login() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Récupérer l'utilisateur avec ce pseudo
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('id, password_hash')
        .eq('pseudo', pseudo)
        .single();

      if (fetchError || !user) {
        setError('Pseudo ou mot de passe incorrect.');
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        setError('Pseudo ou mot de passe incorrect.');
        return;
      }

      // Stocker les infos de session (id utilisateur ou pseudo)
      localStorage.setItem('userId', user.id);
      localStorage.setItem('pseudo', pseudo);

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">Connexion</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Pseudo</label>
          <input
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}