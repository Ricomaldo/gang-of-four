/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : miroirs ✌️/🐌 INDÉPENDANTS (décroiser les pôles), portée gang (filtrage du vrac), branlées, tenant par rejeu.
 * Lot : lot 0 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
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
import { computeRoundScore, detectBranlee } from './scoring';
import { determineWinner, gameLoser, roundLastPlace, roundWinner } from './winner';

/** Les compteurs d'un prénom sur le gang + son prénom. */
export interface PrenomStats {
  prenom: string;
  manchesGagnees: number; // ⭐️
  manchesPerdues: number; // 💥
  partiesGagnees: number; // 🏆
  partiesPerdues: number; // 💩
  brancheesDonnees: number; // l'encoche donnée (donneur de la manche-branlée)
  brancheesPrises: number; // l'encoche prise (les 3 non-donneurs de la manche-branlée, par déduction)
}

/** Le classement du gang : liste variable par prénom + les 2 titres à porteur unique. */
export interface SoireeStats {
  parPrenom: PrenomStats[];
  leader: string | null; // ✌️ — porteur unique, null si 0 partie terminée
  looser: string | null; // 🐌
}

/** Compteurs neufs pour un prénom. */
function emptyStats(prenom: string): PrenomStats {
  return {
    prenom,
    manchesGagnees: 0,
    manchesPerdues: 0,
    partiesGagnees: 0,
    partiesPerdues: 0,
    brancheesDonnees: 0,
    brancheesPrises: 0,
  };
}

/**
 * Compare deux prénoms selon une chaîne de critères décroissants ; premier
 * critère qui distingue → tranche. 0 = pleine égalité sur toute la chaîne.
 */
function compareByChain(
  a: PrenomStats,
  b: PrenomStats,
  fields: ReadonlyArray<keyof Omit<PrenomStats, 'prenom'>>,
): number {
  for (const field of fields) {
    if (a[field] !== b[field]) return a[field] - b[field];
  }
  return 0;
}

const CHAMPION_CHAIN = ['partiesGagnees', 'manchesGagnees', 'brancheesDonnees'] as const;
const LOOSER_CHAIN = ['partiesPerdues', 'manchesPerdues', 'brancheesPrises'] as const;

/** Le sous-groupe de `parPrenom` à égalité sur le meilleur score de la chaîne. */
function bestGroup(
  parPrenom: PrenomStats[],
  fields: ReadonlyArray<keyof Omit<PrenomStats, 'prenom'>>,
): PrenomStats[] {
  let best = parPrenom[0];
  for (const s of parPrenom) {
    if (compareByChain(s, best, fields) > 0) best = s;
  }
  return parPrenom.filter((s) => compareByChain(s, best, fields) === 0);
}

/**
 * Titre par rejeu : à égalité totale sur la chaîne, le tenant reste (il faut le
 * battre, pas seulement l'égaler — cf. signature/palmares.md §départage). Un
 * tenant qui n'est plus dans le groupe des meilleurs est détrôné.
 */
function updateTenant(
  tenant: string | null,
  parPrenom: PrenomStats[],
  fields: ReadonlyArray<keyof Omit<PrenomStats, 'prenom'>>,
): string | null {
  if (parPrenom.length === 0) return null;
  const group = bestGroup(parPrenom, fields);
  if (tenant && group.some((s) => s.prenom === tenant)) return tenant;
  return group[0].prenom;
}

/**
 * Agrège les stats collectives du gang (soirée → gang, cf. brief lot 0). Filtre
 * les parties `terminee`, ignore les prénoms vides (identité malhonnête). Rejoue
 * l'historique en ordre chronologique (`archivedAt`) pour que le départage
 * « tenant reste » soit fondé sur qui a réellement tenu le titre en premier,
 * pas sur l'ordre d'apparition dans le tableau d'entrée.
 */
export function computeSoireeStats(parties: GameArchive[]): SoireeStats {
  const terminees = [...parties.filter((p) => p.status === 'terminee')].sort(
    (a, b) => a.archivedAt - b.archivedAt,
  );
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

  let champion: string | null = null;
  let looser: string | null = null;

  for (const partie of terminees) {
    const prenomOf = (id: PlayerId) => partie.players[id].prenom;

    // Manches : ⭐️ au gagnant, 💥 au dernier, l'encoche au donneur/preneurs de branlée.
    // Le départage L1 de roundLastPlace se lit sur le cumul COURANT (incluant la
    // manche), comme le carnet affiche le running.
    const running = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<PlayerId, number>;
    for (const round of partie.rounds) {
      for (const id of PLAYER_IDS) running[id] += computeRoundScore(round.cardCounts[id]);
      const donneur = roundWinner(round);
      bump(prenomOf(donneur), 'manchesGagnees');
      bump(prenomOf(roundLastPlace(round, running, TABLE_SEATS)), 'manchesPerdues');

      if (detectBranlee(round)) {
        bump(prenomOf(donneur), 'brancheesDonnees');
        for (const id of PLAYER_IDS) {
          if (id !== donneur) bump(prenomOf(id), 'brancheesPrises');
        }
      }
    }

    // Parties : 🏆 au vainqueur, 💩 au perdant.
    bump(prenomOf(determineWinner(partie.rounds, TABLE_SEATS)), 'partiesGagnees');
    bump(prenomOf(gameLoser(partie.rounds, TABLE_SEATS)), 'partiesPerdues');

    // Titres re-dérivés après chaque partie scellée — le tenant ne cède qu'en étant battu.
    const snapshot = [...byPrenom.values()];
    champion = updateTenant(champion, snapshot, CHAMPION_CHAIN);
    looser = updateTenant(looser, snapshot, LOOSER_CHAIN);
  }

  return { parPrenom: [...byPrenom.values()], leader: champion, looser };
}
