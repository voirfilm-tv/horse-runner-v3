/**
 * Génère un lancer de dé standard (1 à 6)
 */
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Vérifie si un lancer est un double (utile si on lance deux dés plus tard)
 */
export function isDouble(a: number, b: number): boolean {
  return a === b;
}

/**
 * Détermine si le joueur peut sortir un pion de l’écurie (6 obligatoire)
 */
export function canLeaveBase(roll: number): boolean {
  return roll === 6;
}