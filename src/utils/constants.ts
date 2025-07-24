// 🎨 Couleurs associées aux joueurs
export const PLAYER_COLORS = ['red', 'blue', 'green', 'yellow'] as const;

export type PlayerColor = (typeof PLAYER_COLORS)[number];

// 🧩 Coordonnées d’écurie initiales par couleur
export const BASE_POSITIONS: Record<PlayerColor, { x: number; y: number }[]> = {
  red: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  blue: [
    { x: 13, y: 0 },
    { x: 14, y: 0 },
    { x: 13, y: 1 },
    { x: 14, y: 1 },
  ],
  green: [
    { x: 0, y: 13 },
    { x: 1, y: 13 },
    { x: 0, y: 14 },
    { x: 1, y: 14 },
  ],
  yellow: [
    { x: 13, y: 13 },
    { x: 14, y: 13 },
    { x: 13, y: 14 },
    { x: 14, y: 14 },
  ],
};

// 🎲 Nombre de pions par joueur
export const PAWNS_PER_PLAYER = 4;

// 💰 Coût fixe pour rejoindre une partie
export const FIXED_GAME_FEE = 40;

// 🔁 Mise par défaut
export const DEFAULT_COIN_BET = 100;