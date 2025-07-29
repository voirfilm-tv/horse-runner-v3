
import { supabase } from './database';

/**
 * Crée une nouvelle partie (game) dans Supabase.
 * @param mode 'realtime' ou 'async'
 * @param coinBet mise en coins (hors frais)
 * @param isPrivate true si partie privée
 * @returns l'objet game ou une erreur
 */
export async function createGame(mode: 'realtime' | 'async', coinBet: number, isPrivate = false) {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('Utilisateur non connecté.');

  const userId = user.data.user.id;
  const pseudo = user.data.user.user_metadata.pseudo;

  // Vérifie les coins disponibles
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('coins')
    .eq('id', userId)
    .single();

  if (userError || !userData) throw new Error('Utilisateur introuvable.');
  const totalCost = coinBet + 40;

  if (userData.coins < totalCost) {
    throw new Error(`Tu as besoin de ${totalCost} coins pour créer cette partie.`);
  }

  // Déduit les coins
  const { error: updateError } = await supabase
    .from('users')
    .update({ coins: userData.coins - totalCost })
    .eq('id', userId);

  if (updateError) throw new Error('Impossible de déduire les coins.');

  // Crée la partie
  const { data: gameData, error: gameError } = await supabase
    .from('games')
    .insert({
      host_id: userId,
      mode,
      coin_bet: coinBet,
      is_private: isPrivate,
    })
    .select()
    .single();

  if (gameError || !gameData) {
    throw new Error('Erreur lors de la création de la partie.');
  }

  return gameData;
}

/**
 * Permet à un joueur de rejoindre une partie privée via son ID.
 * Vérifie que la partie existe et n’est pas terminée.
 */
export async function joinPrivateGame(gameId: string): Promise<void> {
  console.log("🔁 Tentative de chargement partie :", gameId);

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error || !data) {
    console.error("❌ Partie introuvable :", error?.message);
    throw new Error("Partie introuvable.");
  }

  console.log("✅ Partie trouvée :", data);

  if (data.status === 'ended') {
    console.warn("⛔ Partie terminée");
    throw new Error("Cette partie est déjà terminée.");
  }

  console.log("➡️ Rejoindre la partie validé");

  return;
}

/**
 * Liste les parties publiques disponibles
 */
export async function listPublicGames() {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('is_private', false)
    .eq('status', 'waiting') // ou ajuste selon ta logique
    .order('created_at', { ascending: true });

  if (error) {
    console.error("❌ Erreur récupération des parties publiques :", error.message);
    return [];
  }

  return data;
}

/**
 * Charge les joueurs d'une partie donnée
 */
export async function loadPlayers(gameId: string) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('game_id', gameId);

  if (error || !data) {
    console.error("❌ Erreur chargement joueurs :", error.message);
    return [];
  }

  return data;
}

