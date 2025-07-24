import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Inscription d'un nouvel utilisateur avec pseudo et mot de passe.
 */
export async function register(pseudo: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: `${pseudo}@chevaux.local`, // Supabase exige un email, on fake avec domaine local
    password,
    options: {
      data: { pseudo }
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Connexion d'un utilisateur existant avec pseudo et mot de passe.
 */
export async function login(pseudo: string, password: string) {
  const email = `${pseudo}@chevaux.local`;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * Déconnexion de l'utilisateur actuel.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Retourne l'utilisateur actuellement connecté (ou null).
 */
export function getCurrentUser() {
  return supabase.auth.getUser();
}