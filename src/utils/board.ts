export const boardLayout: string[][] = [
  ['base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'path', 'start-blue', 'path', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green'],
  ['base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'safe', 'path', 'path', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green'],
  ['base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'path', 'path', 'path', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green'],
  ['base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'path', 'path', 'path', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green'],
  ['base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'path', 'path', 'path', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green'],
  ['base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'base-red', 'path', 'path', 'path', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green', 'base-green'],
  ['path', 'path', 'path', 'path', 'path', 'path', 'home', 'home', 'home', 'path', 'path', 'path', 'path', 'safe', 'path'],
  ['start-red', 'path', 'path', 'path', 'path', 'path', 'home', 'home', 'home', 'path', 'path', 'path', 'path', 'path', 'start-green'],
  ['path', 'safe', 'path', 'path', 'path', 'path', 'home', 'home', 'home', 'path', 'path', 'path', 'path', 'path', 'path'],
  ['base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'path', 'path', 'path', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow'],
  ['base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'path', 'path', 'path', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow'],
  ['base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'path', 'path', 'path', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow'],
  ['base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'path', 'path', 'path', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow'],
  ['base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'path', 'path', 'safe', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow'],
  ['base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'base-blue', 'path', 'start-yellow', 'path', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow', 'base-yellow']
];

export interface Coord {
  x: number;
  y: number;
}

export function movePawn(path: Coord[], currentIndex: number, steps: number): Coord {
  const newIndex = Math.min(currentIndex + steps, path.length - 1);
  return path[newIndex];
}

export function isSafeCell(x: number, y: number): boolean {
  const cell = boardLayout[y]?.[x];
  return cell === 'safe';
}

export function getDefaultPath(): Coord[] {
  const path: Coord[] = [];
  for (let i = 0; i < 10; i++) {
    path.push({ x: 6 + i, y: 6 });
  }
  return path;
}

/**
 * Vérifie s'il y a collision entre deux pions (même position)
 */
export function isCollision(a: Coord, b: Coord): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Renvoie l'index d'un pion adverse qui serait mangé (ou null)
 */
export function getCapturedPawn(
  target: Coord,
  allPawns: { pos: Coord; playerIndex: number; pawnIndex: number; color: string }[],
  currentPlayerIndex: number
): { playerIndex: number; pawnIndex: number } | null {
  for (const pawn of allPawns) {
    if (
      pawn.playerIndex !== currentPlayerIndex &&
      isCollision(pawn.pos, target) &&
      !isSafeCell(pawn.pos.x, pawn.pos.y)
    ) {
      return { playerIndex: pawn.playerIndex, pawnIndex: pawn.pawnIndex };
    }
  }
  return null;
}



/**
 * Détermine si les 4 pions d’un joueur sont tous dans la case d’arrivée (home)
 */
export function checkVictory(pawns: Coord[]): boolean {
  return pawns.every(p => {
    const x = p.x;
    const y = p.y;
    const cell = boardLayout[y]?.[x];
    return cell === 'home';
  });
}
