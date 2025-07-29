import { supabase } from '@/services/auth';
import { useUserStore } from '@/store/userStore';

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

  if (gameError) throw new Error('Erreur lors de la création de la partie.');

  // Mets à jour le store utilisateur
  const setUser = useUserStore.getState().setUser;
  setUser(pseudo, userData.coins - totalCost);

  return gameData;
}

import { supabase } from '@/services/auth';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';

interface Coord {
  x: number;
  y: number;
}

/**
 * Rejoint une partie existante : ajoute le joueur s'il n'y est pas encore
 */
export async function joinGame(gameId: string) {
  const session = await supabase.auth.getUser();
  const user = session.data.user;
  const pseudo = user?.user_metadata?.pseudo;
  const userId = user?.id;

  if (!user || !pseudo) throw new Error('Utilisateur non connecté.');

  // Récupérer l’état actuel de la partie
  const { data: game, error } = await supabase
    .from('games')
    .select('players_state')
    .eq('id', gameId)
    .single();

  if (error || !game) throw new Error('Partie introuvable.');

  let players = [];
  if (game.players_state) {
    try {
      players = JSON.parse(game.players_state);
    } catch (err) {
      console.warn('Erreur de parsing players_state, reset...');
    }
  }

  const alreadyInGame = players.some((p: any) => p.id === userId);
  if (!alreadyInGame) {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const usedColors = players.map((p: any) => p.color);
    const availableColor = colors.find(c => !usedColors.includes(c));
    if (!availableColor) throw new Error('Partie déjà pleine.');

    const newPlayer = {
      id: userId,
      pseudo,
      color: availableColor,
      pawns: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ] as Coord[],
    };

    players.push(newPlayer);

    await supabase
      .from('games')
      .update({ players_state: JSON.stringify(players) })
      .eq('id', gameId);
  }

  const setPlayers = useGameStore.getState().setPlayers;
  setPlayers(players);
}

/**
 * Récupère la liste des parties publiques en attente
 */
export async function listPublicGames() {
  const { data, error } = await supabase
    .from('games')
    .select('id, mode, coin_bet, created_at')
    .eq('is_private', false)
    .eq('status', 'waiting')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[listPublicGames] Erreur:', error.message);
    return [];
  }

  return data;
}

/**
 * Matchmaking automatique : rejoint une partie publique ou en crée une
 */
export async function autoJoinOrCreate(): Promise<string> {
  const existing = await listPublicGames();

  if (existing.length > 0) {
    return existing[0].id; // rejoint la première trouvée
  }

  // Sinon, créer une nouvelle partie publique (par défaut realtime, mise 100)
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data: newGame, error } = await supabase
    .from('games')
    .insert({
      host_id: user.id,
      mode: 'realtime',
      coin_bet: 100,
      is_private: false,
      status: 'waiting',
    })
    .select()
    .single();

  if (error || !newGame) throw new Error('Erreur lors de la création de la partie');

  return newGame.id;
}

/**
 * Enregistre la victoire dans la table history
 */
export async function logVictory(gameId: string, winnerId: string, players: any[]) {
  const entries = players.map((player) => ({
    game_id: gameId,
    user_id: player.id,
    coins_won: player.id === winnerId ? player.coin_bet * (players.length - 1) : 0,
    result: player.id === winnerId ? 'win' : 'lose',
  }));

  const { error } = await supabase.from('history').insert(entries);
  if (error) {
    console.error('[logVictory] Erreur insertion historique :', error.message);
  }
}


/**
 * Permet à un joueur de rejoindre une partie privée via son ID.
 * Vérifie que la partie existe et n’est pas terminée.
 */
export async function joinPrivateGame(gameId: string): Promise<void> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error || !data) {
    throw new Error("Partie introuvable.");
  }

  if (data.status === 'ended') {
    throw new Error("Cette partie est déjà terminée.");
  }

  // Optionnel : ici, tu pourrais vérifier s'il reste de la place ou enregistrer le joueur

  return;
}
