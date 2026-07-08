import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Game, GameArchive, PlayerId, Player, Round, GameStatus, Soiree } from '../domain/model';

const KEY = 'gof:soiree';
const GAME_KEY = 'gof:game';

/** Retourne YYYY-MM-DD pour un timestamp, avec tolérance nuit (avant 5h = veille). */
export function soireeDate(ts: number): string {
  const d = new Date(ts);
  if (d.getHours() < 5) d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/** Construit ou met à jour la soirée courante avec une nouvelle archive. */
export function appendToSoiree(soiree: Soiree | null, archive: GameArchive): Soiree {
  const date = soireeDate(archive.archivedAt);
  if (soiree && soiree.date === date) {
    return { date, parties: [...soiree.parties, archive] };
  }
  // Nouvelle soirée (jour différent ou première soirée)
  return { date, parties: [archive] };
}

export async function saveSoiree(soiree: Soiree): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(soiree));
}

export async function loadSoiree(): Promise<Soiree | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  return JSON.parse(raw) as Soiree;
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
