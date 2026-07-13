/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : soirée-unique → LE VRAC (terminées, inter-sessions, local P1) — stockage neuf, repart à zéro (nouveau build, rien à migrer).
 * Lot : lot 0 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Game, GameArchive, PlayerId, Player, Round, GameStatus, Soiree, Vrac } from '../domain/model';
import { PLAYER_IDS } from '../domain/model';

const VRAC_KEY = 'gof:vrac';
const GAME_KEY = 'gof:game';

/** Retourne YYYY-MM-DD pour un timestamp, avec tolérance nuit (avant 5h = veille). */
export function soireeDate(ts: number): string {
  const d = new Date(ts);
  if (d.getHours() < 5) d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/** Ajoute une GameArchive terminée au vrac (à plat, aucun regroupement à l'écriture). */
export function appendToVrac(vrac: Vrac, archive: GameArchive): Vrac {
  return { schemaVersion: vrac.schemaVersion, parties: [...vrac.parties, archive] };
}

export async function saveVrac(vrac: Vrac): Promise<void> {
  await AsyncStorage.setItem(VRAC_KEY, JSON.stringify(vrac));
}

/** Absent/null → vrac vide (pas de legacy, build neuf). */
export async function loadVrac(): Promise<Vrac> {
  const raw = await AsyncStorage.getItem(VRAC_KEY);
  if (!raw) return { schemaVersion: 1, parties: [] };
  return JSON.parse(raw) as Vrac;
}

/** Clé canonique d'un gang : ses 4 prénoms triés, joints — identité = ensemble de prénoms, roster-scoped. */
export function gangKey(players: Record<PlayerId, Player>): string {
  // Prénoms normalisés trim + casse (specs-ecrans §L'accueil) : « Marc » et « marc »
  // sont le même gang — sans id joueur, c'est le prix d'Identité = A.
  return PLAYER_IDS.map((id) => players[id].prenom.trim().toLowerCase()).sort().join('|');
}

/** Filtre le vrac sur un gang précis (mêmes 4 prénoms triés) — aucune réconciliation entre rosters. */
export function filterByGang(parties: GameArchive[], key: string): GameArchive[] {
  return parties.filter((p) => gangKey(p.players) === key);
}

/** Groupe des parties par soirée dérivée (soireeDate), sans regroupement stocké. Ordre = première apparition. */
export function groupBySoiree(parties: GameArchive[]): Soiree[] {
  const byDate = new Map<string, GameArchive[]>();
  for (const p of parties) {
    const date = soireeDate(p.archivedAt);
    const bucket = byDate.get(date);
    if (bucket) bucket.push(p);
    else byDate.set(date, [p]);
  }
  return [...byDate.entries()].map(([date, datedParties]) => ({ date, parties: datedParties }));
}

/** Partie EN COURS — persistée à chaque manche pour survivre à une app tuée (SMS, éviction OS). */
export async function saveGame(game: Game): Promise<void> {
  await AsyncStorage.setItem(GAME_KEY, JSON.stringify(game));
}

export async function loadGame(): Promise<Game | null> {
  const raw = await AsyncStorage.getItem(GAME_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as Game;
}

/** Partie terminée (archivée dans la soirée) : plus rien à reprendre. */
export async function clearGame(): Promise<void> {
  await AsyncStorage.removeItem(GAME_KEY);
}
