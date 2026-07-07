/**
 * Stats de soirée — module PUR (aucun état, aucun stockage).
 * Agrège sur les parties `terminee` d'une soirée, CLÉ = prénom (jamais le siège :
 * le siège 0-3 est réutilisé, deux personnes s'y mélangeraient — cf. specs-stats.md).
 *
 * Rien n'est stocké : les 4 compteurs + les 2 titres se DÉRIVENT à chaque appel
 * depuis `GameArchive[]`. Une partie interrompue n'alimente aucune stat.
 */
import type { GameArchive, PlayerId } from './model';
import { PLAYER_IDS, TABLE_SEATS } from './model';
import { computeRoundScore } from './scoring';
import { determineWinner, gameLoser, roundLastPlace, roundWinner } from './winner';

/** Les 4 compteurs d'un prénom sur la soirée + son prénom. */
export interface PrenomStats {
  prenom: string;
  manchesGagnees: number; // ⭐️
  manchesPerdues: number; // 💥
  partiesGagnees: number; // 🏆
  partiesPerdues: number; // ❌
}

/** Le classement du soir : liste variable par prénom + les 2 titres à porteur unique. */
export interface SoireeStats {
  parPrenom: PrenomStats[];
  leader: string | null; // ✌️ — porteur unique, null si 0 partie terminée
  looser: string | null; // 🐌
}

/** Compteurs neufs pour un prénom. */
function emptyStats(prenom: string): PrenomStats {
  return { prenom, manchesGagnees: 0, manchesPerdues: 0, partiesGagnees: 0, partiesPerdues: 0 };
}

/**
 * Agrège les stats collectives de la soirée. Filtre les parties `terminee`, ignore
 * les prénoms vides (identité malhonnête). L'ordre de `parPrenom` est stable
 * (première apparition), ce qui rend aussi le départage des titres déterministe.
 */
export function computeSoireeStats(parties: GameArchive[]): SoireeStats {
  const terminees = parties.filter((p) => p.status === 'terminee');
  const byPrenom = new Map<string, PrenomStats>();

  const bump = (prenom: string, field: keyof Omit<PrenomStats, 'prenom'>) => {
    const key = prenom.trim();
    if (!key) return; // prénom vide exclu
    let s = byPrenom.get(key);
    if (!s) {
      s = emptyStats(key);
      byPrenom.set(key, s);
    }
    s[field] += 1;
  };

  for (const partie of terminees) {
    const prenomOf = (id: PlayerId) => partie.players[id].prenom;

    // Manches : ⭐️ au gagnant, 💥 au dernier. Le départage L1 de roundLastPlace se
    // lit sur le cumul COURANT (incluant la manche), comme le carnet affiche le running.
    const running = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<PlayerId, number>;
    for (const round of partie.rounds) {
      for (const id of PLAYER_IDS) running[id] += computeRoundScore(round.cardCounts[id]);
      bump(prenomOf(roundWinner(round)), 'manchesGagnees');
      bump(prenomOf(roundLastPlace(round, running, TABLE_SEATS)), 'manchesPerdues');
    }

    // Parties : 🏆 au vainqueur, ❌ au perdant.
    bump(prenomOf(determineWinner(partie.rounds, TABLE_SEATS)), 'partiesGagnees');
    bump(prenomOf(gameLoser(partie.rounds, TABLE_SEATS)), 'partiesPerdues');
  }

  const parPrenom = [...byPrenom.values()];
  return { parPrenom, leader: pickLeader(parPrenom), looser: pickLooser(parPrenom) };
}

/**
 * Réduit sur `parPrenom` (ordre stable) et garde le meilleur selon `better`.
 * En pleine égalité, le premier vu l'emporte → porteur unique garanti dès 1 partie.
 */
function pickTitle(
  parPrenom: PrenomStats[],
  better: (a: PrenomStats, b: PrenomStats) => boolean,
): string | null {
  if (parPrenom.length === 0) return null;
  let best = parPrenom[0];
  for (const s of parPrenom.slice(1)) {
    if (better(s, best)) best = s;
  }
  return best.prenom;
}

/** Leader ✌️ : le plus de 🏆 ; départage moins de ❌, puis plus de ⭐️. */
function pickLeader(parPrenom: PrenomStats[]): string | null {
  return pickTitle(parPrenom, (a, b) => {
    if (a.partiesGagnees !== b.partiesGagnees) return a.partiesGagnees > b.partiesGagnees;
    if (a.partiesPerdues !== b.partiesPerdues) return a.partiesPerdues < b.partiesPerdues;
    return a.manchesGagnees > b.manchesGagnees;
  });
}

/** Looser 🐌 : le plus de ❌ ; départage moins de 🏆, puis plus de 💥. */
function pickLooser(parPrenom: PrenomStats[]): string | null {
  return pickTitle(parPrenom, (a, b) => {
    if (a.partiesPerdues !== b.partiesPerdues) return a.partiesPerdues > b.partiesPerdues;
    if (a.partiesGagnees !== b.partiesGagnees) return a.partiesGagnees < b.partiesGagnees;
    return a.manchesPerdues > b.manchesPerdues;
  });
}
