import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import * as bcrypt from 'bcrypt-ts';

export default function Register() {
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pseudo || !password) {
      setError('Pseudo et mot de passe requis.');
      return;
    }

    try {
      // Vérifier si le pseudo existe déjà
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('pseudo', pseudo)
        .single();

      if (existingUser) {
        setError('Ce pseudo est déjà pris.');
        return;
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer le nouvel utilisateur
      const { error: insertError } = await supabase.from('users').insert([
        {
          pseudo,
          password_hash: hashedPassword,
          coin: 500,
          last_bonus: new Date().toISOString()
        }
      ]);

      if (insertError) {
        setError('Erreur lors de la création du compte.');
        console.error(insertError);
        return;
      }

      // Rediriger vers la connexion
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">Créer un compte</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
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
          Créer mon compte
        </button>
      </form>
    </div>
  );
}