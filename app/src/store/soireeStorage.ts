import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameArchive, PlayerId, Player, Round, GameStatus, Soiree } from '../domain/model';

const KEY = 'gof:soiree';

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
