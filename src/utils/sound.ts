// utils/sound.ts

const soundMap: Record<string, string> = {
  bonus: '/assets/sounds/bonus.mp3',
  click: '/assets/sounds/button-click.mp3',
  capture: '/assets/sounds/capture.mp3',
  dice: '/assets/sounds/dice-roll.mp3',
  error: '/assets/sounds/error.mp3',
  join: '/assets/sounds/join.mp3',
  victory: '/assets/sounds/victory.mp3',
};

/**
 * Joue un son en fonction de son nom (clé définie dans soundMap)
 * @param name - 'dice', 'error', 'join', etc.
 */
export function playSound(name: string) {
  const path = soundMap[name];
  if (!path) return;

  const audio = new Audio(path);
  audio.volume = 0.8;
  audio.play().catch((err) => {
    console.warn('Erreur audio :', err);
  });
}