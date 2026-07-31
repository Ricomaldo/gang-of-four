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
import { StyleSheet, Text, View } from 'react-native';
import { SEAT_ORDER } from '../domain/model';
import type { GameArchive, PlayerId } from '../domain/model';
import { computeRoundScore, computeTotals, detectBranlee } from '../domain/scoring';
import { roundWinner } from '../domain/winner';
import { fonts, matiere, palette, typography } from '../theme/tokens';

/** La marque branlée = l'encoche ‡ (petite) / ‡‡ (grosse). Ok Eric 18/07 (supersede l'encoche `/` `//`). */
const ENCOCHE: Record<'petite' | 'grosse', string> = { petite: '‡', grosse: '‡‡' };

/** Ligne TOT — le cumul final : Anton sur crème, trait fort 4px, le total du MENEUR inversé. */
export function TotRow({ totals }: { totals: Record<PlayerId, number> }) {
  const lastId = SEAT_ORDER[SEAT_ORDER.length - 1];
  const min = Math.min(...SEAT_ORDER.map((id) => totals[id]));
  return (
    <View style={[styles.row, styles.totalRow]}>
      <View style={[styles.labelCell, styles.totalLabel]}>
        <Text style={styles.totalLabelText}>TOT</Text>
      </View>
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
}: {
  archive: GameArchive;
  isLive: boolean;
  /** Version simple (cumul, sans branlée, comme la 0.1) vs détail (score par manche + branlées). */
  showDetails: boolean;
}) {
  const { players, rounds } = archive;
  const totals = computeTotals(rounds);
  const lastId = SEAT_ORDER[SEAT_ORDER.length - 1];

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

  return (
    <View style={styles.feuille}>
      {/* En-tête colonnes : mono gris sous trait 3px. */}
      <View style={[styles.row, styles.headRow]}>
        <View style={styles.labelCell} />
        {SEAT_ORDER.map((id) => (
          <View key={id} style={[styles.cell, styles.headCell, id !== lastId && styles.colDivider]}>
            <Text style={styles.headText} numberOfLines={1}>{players[id].prenom || '?'}</Text>
          </View>
        ))}
      </View>

      {rows.length === 0 ? (
        <View style={styles.row}>
          <View style={styles.labelCell}>
            <Text style={styles.labelText}>M1</Text>
          </View>
          {SEAT_ORDER.map((id) => (
            <View key={id} style={[styles.cell, id !== lastId && styles.colDivider]}>
              <Text style={styles.cumul}>·</Text>
            </View>
          ))}
        </View>
      ) : (
        rows.map((row) => {
          const showBranlee = showDetails && !!row.branlee;
          return (
            <View key={row.i}>
              <View
                style={[
                  styles.row,
                  row.matiere === 'crayon' && styles.rowCrayon,
                  showBranlee && styles.rowBranlee,
                ]}
              >
                <View style={[styles.labelCell, showBranlee && styles.labelCellBranlee]}>
                  <Text style={[styles.labelText, showBranlee && styles.textInverse]}>M{row.i + 1}</Text>
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
              {showBranlee && (
                <Text style={styles.legende}>
                  {ENCOCHE[row.branlee!]} {row.branlee} branlée de {row.donneurPrenom} !
                </Text>
              )}
            </View>
          );
        })
      )}

      <TotRow totals={totals} />
    </View>
  );
}

const styles = StyleSheet.create({
  feuille: {},
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: palette.encre },
  // En-tête sous trait fort 3px (placard).
  headRow: { borderBottomWidth: 3, borderColor: palette.encre },

  colDivider: { borderRightWidth: 1, borderRightColor: palette.encre },

  // La colonne M-label (M1…Mn / TOT) — remplace l'ancienne colonne de sens de jeu
  // (le sens vit sur le plateau du Round, pas ici).
  labelCell: { width: 44, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  labelCellBranlee: { backgroundColor: matiere.grave.fond },
  labelText: { ...typography.chrome, fontSize: 11, color: palette.murmure },

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
  totalLabelText: { ...typography.chrome, fontSize: 11, color: palette.murmure },
  totLeaderCell: { backgroundColor: palette.encre },
  totalText: { fontFamily: fonts.affiche, fontSize: 24, color: palette.encre },
  totalTextLeader: { color: palette.cremePage },
});
