/* ═══ RESHAPE 0.2 · TAG [R] reshapé — LE PLACARD ═══
 * Cible : la grille manche × joueur d'UNE partie — cellules = scores de manche
 * (le cumul vit sur TOT), deux matières crayon/gravé, la marque branlée = ‡ / ‡‡.
 * Specs : GANG - Specs placard §Feuille (fait foi) · signature/branlee.md.
 * ═══════════════════════════════ */
/**
 * Feuille — la grille de la fiche-écran 04, en placard. Zone présentationnelle :
 * dérive tout de l'archive, ne stocke rien. Trois matières lisibles d'un coup :
 *  - GRAVÉ (le reste) : mono, sur crème, traits nets.
 *  - CRAYON (dernière manche d'une partie vivante, non branlée) : cadre dashed
 *    orangé, chiffres gris — éditable.
 *  - BRANLÉE (n'importe où) : bande INVERSÉE (fond encre, chiffres Anton crème),
 *    le score du donneur « 0 ‡ » en rouge clair, légende brique dessous. Ça pèse.
 * Précédence : une branlée scellée est TOUJOURS gravée, même en dernière manche.
 */
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SEAT_ORDER } from '../domain/model';
import type { GameArchive, PlayerId } from '../domain/model';
import { computeRoundScore, computeTotals, detectBranlee } from '../domain/scoring';
import { directionOfPlay } from '../domain/direction';
import { roundWinner } from '../domain/winner';
import { fonts, matiere, palette, typography } from '../theme/tokens';

/** La marque branlée = l'encoche ‡ (petite) / ‡‡ (grosse). Ok Eric 18/07 (supersede l'encoche `/` `//`). */
const ENCOCHE: Record<'petite' | 'grosse', string> = { petite: '‡', grosse: '‡‡' };

/** Le sens de jeu de la manche (1-indexée), rendu comme sur la feuille papier :
 *  anti-horaire = →, horaire = ← (mapping FD-09). Réintroduit le 31/07 (Eric) —
 *  la 1ʳᵉ colonne redevient la flèche (remplace le « Mx » du placard). */
const dirGlyph = (roundNumber: number): string => (directionOfPlay(roundNumber) === 'anti-horaire' ? '→' : '←');

/** « 8 juin » — jour + mois en lettres, sans année (le contexte hors-app suffit). */
function formatSessionDate(ts: number): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(ts));
}

/** Ligne TOT — le cumul final : Anton sur crème, trait fort 4px, le total du MENEUR inversé. */
export function TotRow({ totals }: { totals: Record<PlayerId, number> }) {
  const lastId = SEAT_ORDER[SEAT_ORDER.length - 1];
  const min = Math.min(...SEAT_ORDER.map((id) => totals[id]));
  return (
    <View style={[styles.row, styles.totalRow]}>
      {/* Plus de « TOT » : la ligne Anton en gras se lit d'elle-même (Eric 11/08).
          Cellule vide conservée pour l'alignement des colonnes. */}
      <View style={[styles.labelCell, styles.totalLabel]} />
      {SEAT_ORDER.map((id) => {
        const leader = totals[id] === min;
        return (
          <View
            key={id}
            style={[styles.cell, id !== lastId && styles.colDivider, leader && styles.totLeaderCell]}
          >
            <Text style={[styles.totalText, leader && styles.totalTextLeader]}>{totals[id]}</Text>
          </View>
        );
      })}
    </View>
  );
}

export function Feuille({
  archive,
  isLive,
  showDetails,
  onCorrigerDerniere,
  onSetLieu,
  capturing = false,
}: {
  archive: GameArchive;
  isLive: boolean;
  /** Version simple (cumul, sans branlée, comme la 0.1) vs détail (score par manche + branlées). */
  showDetails: boolean;
  /** Solution B (partie en cours only) : tap sur la ligne crayon (dernière manche
   *  corrigeable) → referme la feuille et rouvre la saisie du Round pré-remplie.
   *  Absent pour une archive passée ou une partie scellée (pas de ligne crayon). */
  onCorrigerDerniere?: () => void;
  /** Partie EN COURS : rend le lieu éditable inline (persiste au store). Absent
   *  pour une archive passée → le lieu (s'il existe) est en lecture seule. */
  onSetLieu?: (v: string) => void;
  /** Vrai pendant la capture de partage : on gèle le lieu en TEXTE (ni placeholder
   *  « + lieu », ni curseur ne doivent polluer l'image). */
  capturing?: boolean;
}) {
  const { players, rounds } = archive;
  const totals = computeTotals(rounds);
  const lastId = SEAT_ORDER[SEAT_ORDER.length - 1];
  const dateLabel = formatSessionDate(archive.archivedAt);

  const rows = rounds.map((r, i) => {
    const donneur = roundWinner(r);
    const branlee = detectBranlee(r);
    const isLastRound = i === rounds.length - 1;
    const matiere: 'crayon' | 'gravé' = !branlee && isLive && isLastRound ? 'crayon' : 'gravé';
    const cumulTotals = computeTotals(rounds.slice(0, i + 1));
    const cells = SEAT_ORDER.map((id) => ({
      id,
      pts: computeRoundScore(r.cardCounts[id]),
      cumul: cumulTotals[id],
      isDonneur: id === donneur,
    }));
    return { i, cells, branlee, matiere, donneurPrenom: players[donneur].prenom };
  });

  // Feuille vivante : au moins 4 lignes ET au moins une vide (la place de la manche
  // suivante) — le paquet de lignes réglées d'une feuille papier. Partie scellée
  // (terminée) : aucune ligne vide, la feuille est close.
  const emptyCount = isLive ? Math.max(1, 4 - rounds.length) : 0;

  return (
    <View style={styles.feuille}>
      {/* Date + lieu — DANS la zone capturée (portés au partage). Lieu éditable
          inline pour la partie en cours ; lecture seule pour une archive passée. */}
      <View style={styles.metaRow}>
        <Text style={styles.metaDate}>{dateLabel}</Text>
        {onSetLieu && !capturing ? (
          <>
            <Text style={styles.metaSep}> · </Text>
            <TextInput
              style={styles.metaLieuInput}
              value={archive.lieu ?? ''}
              onChangeText={onSetLieu}
              placeholder="+ lieu"
              placeholderTextColor={palette.estompe}
              maxLength={24}
            />
          </>
        ) : archive.lieu ? (
          // Capture, ou archive passée : le lieu en texte pur (ni placeholder ni curseur).
          <Text style={styles.metaLieu}> · {archive.lieu}</Text>
        ) : null}
      </View>

      {/* En-tête colonnes : mono gris sous trait 3px. 1ʳᵉ colonne = sens de jeu (↔). */}
      <View style={[styles.row, styles.headRow]}>
        <View style={styles.labelCell}>
          <Text style={styles.dirHead}>↔</Text>
        </View>
        {SEAT_ORDER.map((id) => (
          <View key={id} style={[styles.cell, styles.headCell, id !== lastId && styles.colDivider]}>
            <Text style={styles.headText} numberOfLines={1}>{players[id].prenom || '?'}</Text>
          </View>
        ))}
      </View>

      {rows.map((row) => {
          const showBranlee = showDetails && !!row.branlee;
          // La ligne crayon (dernière manche vivante non-branlée) est la SEULE
          // corrigeable : tap → rouvre la saisie du Round (solution B).
          const editable = !!onCorrigerDerniere && row.matiere === 'crayon';
          const rowInner = (
            <View
              style={[
                styles.row,
                row.matiere === 'crayon' && styles.rowCrayon,
                showBranlee && styles.rowBranlee,
              ]}
            >
              <View style={[styles.labelCell, showBranlee && styles.labelCellBranlee]}>
                <Text style={[styles.dirText, showBranlee && styles.textInverse]}>{dirGlyph(row.i + 1)}</Text>
              </View>
              {row.cells.map((c) => {
                const isBranleeDonneur = showBranlee && c.isDonneur;
                return (
                  <View key={c.id} style={[styles.cell, c.id !== lastId && styles.colDivider]}>
                    <Text
                      style={[
                        styles.cumul,
                        row.matiere === 'crayon' && styles.cumulCrayon,
                        showBranlee && styles.cumulBranlee,
                        isBranleeDonneur && styles.cumulDonneur,
                      ]}
                    >
                      {showDetails ? c.pts : c.cumul}
                      {isBranleeDonneur ? ` ${ENCOCHE[row.branlee!]}` : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
          return (
            <View key={row.i}>
              {editable ? (
                <TouchableOpacity onPress={onCorrigerDerniere} activeOpacity={0.7} accessibilityLabel="Corriger la dernière manche">
                  {rowInner}
                </TouchableOpacity>
              ) : (
                rowInner
              )}
              {showBranlee && (
                <Text style={styles.legende}>
                  {ENCOCHE[row.branlee!]} {row.branlee} branlée de {row.donneurPrenom} !
                </Text>
              )}
            </View>
          );
        })}

      {/* Padding en lignes vides (glyphe de sens + ·) : tenir au moins 4 lignes ET
          au moins une vide tant que la partie vit. */}
      {Array.from({ length: emptyCount }, (_, k) => {
        const mancheNo = rounds.length + k + 1;
        return (
          <View key={`empty-${k}`} style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.dirText}>{dirGlyph(mancheNo)}</Text>
            </View>
            {SEAT_ORDER.map((id) => (
              <View key={id} style={[styles.cell, id !== lastId && styles.colDivider]}>
                <Text style={styles.cumul}>·</Text>
              </View>
            ))}
          </View>
        );
      })}

      <TotRow totals={totals} />
    </View>
  );
}

const styles = StyleSheet.create({
  feuille: {},
  // Date + lieu, en tête de grille (capturé au partage).
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  metaDate: { ...typography.chrome, fontSize: 14, color: palette.encre },
  metaSep: { ...typography.chrome, fontSize: 14, color: palette.murmure },
  metaLieu: { ...typography.chrome, fontSize: 14, color: palette.murmure },
  metaLieuInput: { ...typography.chrome, fontSize: 14, color: palette.murmure, minWidth: 80, paddingVertical: 0 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: palette.encre },
  // En-tête sous trait fort 3px (placard).
  headRow: { borderBottomWidth: 3, borderColor: palette.encre },

  colDivider: { borderRightWidth: 1, borderRightColor: palette.encre },

  // 1ʳᵉ colonne = le sens de jeu (flèche par manche, réintroduit 31/07). La ligne
  // TOT y laisse une cellule vide (le « TOT » retiré). Placard : pas de colonne grise ombrée.
  labelCell: { width: 44, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  labelCellBranlee: { backgroundColor: matiere.grave.fond },
  // La flèche →/← (anti-horaire/horaire, FD-09), en encre ; l'entête = ↔ atténué.
  dirText: { ...typography.chrome, fontSize: 16, color: palette.encre },
  dirHead: { ...typography.chrome, fontSize: 13, color: palette.murmure },

  // Matière crayon — la dernière manche d'une partie vivante : cadre dashed orangé.
  rowCrayon: { borderWidth: 1.5, borderColor: matiere.crayon.bordure, borderStyle: 'dashed', borderBottomWidth: 1.5 },
  // La branlée pèse : bande inversée (fond encre), un filet clair en tête = le « creusé ».
  rowBranlee: { backgroundColor: matiere.grave.fond, borderColor: matiere.grave.fond, borderTopWidth: 1, borderTopColor: matiere.grave.reliefHaut },
  textInverse: { color: matiere.grave.encre },

  cell: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 2 },
  // Gravé : mono, net. Crayon : gris. Branlée : Anton crème. Donneur : Anton rouge clair.
  cumul: { ...typography.chrome, fontSize: 17, color: palette.encre, textAlign: 'center' },
  cumulCrayon: { color: matiere.crayon.encre },
  cumulBranlee: { fontFamily: fonts.affiche, fontSize: 20, color: matiere.grave.encre },
  cumulDonneur: { color: palette.rougeClair },
  legende: { ...typography.chrome, fontSize: 11, color: palette.brique, textAlign: 'right', paddingVertical: 4, paddingRight: 4 },

  headCell: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  headText: { ...typography.chrome, fontSize: 12, color: palette.murmure },

  // TOTAL : trait fort 4px, Anton, sur crème ; le meneur en cellule inversée.
  totalRow: { borderTopWidth: 4, borderColor: palette.encre, borderBottomWidth: 0 },
  totalLabel: {},
  totLeaderCell: { backgroundColor: palette.encre },
  totalText: { fontFamily: fonts.affiche, fontSize: 24, color: palette.encre },
  totalTextLeader: { color: palette.cremePage },
});
