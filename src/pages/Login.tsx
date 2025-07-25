
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import * as bcrypt from 'bcrypt-ts';

export default function Login() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      console.log('🔄 Redirection automatique vers / car déjà connecté');
      navigate('/');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!pseudo || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
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

      localStorage.setItem('userId', user.id);
      localStorage.setItem('pseudo', pseudo);
      setSuccess('Connexion réussie, redirection...');
      console.log('✅ Connexion réussie pour', pseudo);
      setTimeout(() => window.location.href = '/', 1000);
    } catch (err) {
      console.error('Erreur login:', err);
      setError('Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">Connexion</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
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
      <p className="text-sm text-center mt-4">
        Pas encore de compte ?{' '}
        <a href="/register" className="text-green-700 underline hover:text-green-800">
          Créer un compte
        </a>
      </p>
    </div>
  );
}
