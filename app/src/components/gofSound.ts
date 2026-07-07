/**
 * Tirage du son de la frime GoF. Logique pure (aucun asset importé ici) → testable sans natif.
 *
 * La seule règle : jamais deux fois le même son d'affilée. Le tirage aléatoire brut
 * pouvait, à l'usage, retomber sur le même (« toujours celui qui se lance ») ; on force
 * donc la variété en excluant l'index précédent.
 */
let last = -1;

/** Index du prochain son : aléatoire, mais jamais celui d'avant. `rand` injectable pour les tests. */
export function nextGofSoundIndex(count: number, rand: () => number = Math.random): number {
  if (count <= 1) return 0;
  let i = Math.floor(rand() * count) % count;
  if (i === last) i = (i + 1) % count;
  last = i;
  return i;
}

/** Remet le compteur à zéro (tests). */
export function resetGofSound(): void {
  last = -1;
}
