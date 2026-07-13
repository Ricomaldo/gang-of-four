/* ═══ RESHAPE 0.2 · TAG [N] neuf — reshape de ScoreCarnet.tsx (supprimé) ═══
 * Cible : la grille manche × joueur d'UNE partie — cellules = scores de manche
 * (le cumul vit sur TOT), deux matières crayon/gravé, l'encoche `/` `//` qui pèse.
 * Lot : lot 3b — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md §La stèle & la feuille ·
 *   signature/ecrans/04-feuille.md · signature/branlee.md (fait foi).
 * ═══════════════════════════════ */
/**
 * Feuille — la grille de la fiche-écran 04. Zone présentationnelle : dérive
 * tout de l'archive, ne stocke rien. Précédence de matière : une branlée
 * scellée (graver) est TOUJOURS gravée, même si c'est la dernière manche
 * d'une partie encore en cours — le crayon ne s'applique qu'à une manche
 * ordinaire non scellée par une cérémonie.
 */
import { StyleSheet, Text, View } from 'react-native';
import { SEAT_ORDER } from '../domain/model';
import type { GameArchive, PlayerId } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeRoundScore, computeTotals, detectBranlee } from '../domain/scoring';
import { roundWinner } from '../domain/winner';
import { matiere, palette, typography } from '../theme/tokens';

const ENCOCHE: Record<'petite' | 'grosse', string> = { petite: '/', grosse: '//' };

/** Ligne TOT seule — le cumul final, fond noir / texte clair (déjà signé). */
export function TotRow({ totals }: { totals: Record<PlayerId, number> }) {
  const lastId = SEAT_ORDER[SEAT_ORDER.length - 1];
  return (
    <View style={[styles.row, styles.totalRow]}>
      <View style={[styles.dirCell, styles.totalDir, styles.colDividerLight]}>
        <Text style={styles.totalDirText}>TOT</Text>
      </View>
      {SEAT_ORDER.map((id) => (
        <View key={id} style={[styles.cell, id !== lastId && styles.colDividerLight]}>
          <Text style={styles.totalText}>{totals[id]}</Text>
        </View>
      ))}
    </View>
  );
}

export function Feuille({ archive, isLive }: { archive: GameArchive; isLive: boolean }) {
  const { players, rounds } = archive;
  const totals = computeTotals(rounds);
  const lastId = SEAT_ORDER[SEAT_ORDER.length - 1];

  const rows = rounds.map((r, i) => {
    const donneur = roundWinner(r);
    const branlee = detectBranlee(r);
    const isLastRound = i === rounds.length - 1;
    // Précédence : une branlée scellée est TOUJOURS gravée — le crayon ne
    // s'applique qu'à une dernière manche ordinaire d'une partie vivante.
    const matiere: 'crayon' | 'gravé' = !branlee && isLive && isLastRound ? 'crayon' : 'gravé';
    const cells = SEAT_ORDER.map((id) => ({
      id,
      pts: computeRoundScore(r.cardCounts[id]),
      isDonneur: id === donneur,
    }));
    return { i, direction: directionOfPlay(i + 1), cells, branlee, matiere, donneurPrenom: players[donneur].prenom };
  });

  return (
    <View style={styles.feuille}>
      {/* En-tête colonnes */}
      <View style={[styles.row, styles.headRow]}>
        <View style={[styles.dirCell, styles.headDir]}>
          <Text style={styles.headDirText}>↔</Text>
        </View>
        {SEAT_ORDER.map((id) => (
          <View key={id} style={[styles.cell, styles.headCell, id !== lastId && styles.colDivider]}>
            <Text style={styles.headText}>{players[id].prenom || '?'}</Text>
          </View>
        ))}
      </View>

      {rows.length === 0 ? (
        <View style={styles.row}>
          <View style={styles.dirCell}>
            <Text style={styles.dirText}>{directionOfPlay(1) === 'anti-horaire' ? '→' : '←'}</Text>
          </View>
          {SEAT_ORDER.map((id) => (
            <View key={id} style={[styles.cell, id !== lastId && styles.colDivider]}>
              <Text style={styles.cumul}>—</Text>
            </View>
          ))}
        </View>
      ) : (
        rows.map((row) => (
          <View key={row.i}>
            <View
              style={[
                styles.row,
                row.matiere === 'crayon' ? styles.rowCrayon : styles.rowGrave,
                row.branlee && styles.rowBranlee,
              ]}
            >
              <View style={[styles.dirCell, row.branlee && styles.dirCellBranlee]}>
                <Text style={[styles.dirText, row.branlee && styles.textInverse]}>
                  {row.direction === 'anti-horaire' ? '→' : '←'}
                </Text>
              </View>
              {row.cells.map((c) => (
                <View key={c.id} style={[styles.cell, c.id !== lastId && styles.colDivider]}>
                  <Text style={[styles.cumul, row.branlee && styles.textInverse]}>
                    {c.pts}
                    {row.branlee && c.isDonneur ? ` ${ENCOCHE[row.branlee]}` : ''}
                  </Text>
                </View>
              ))}
            </View>
            {row.branlee && (
              <Text style={styles.legende}>
                {row.branlee} branlée de {row.donneurPrenom}
              </Text>
            )}
          </View>
        ))
      )}

      <TotRow totals={totals} />
    </View>
  );
}

const styles = StyleSheet.create({
  feuille: {},
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: palette.bordure },
  headRow: { borderBottomWidth: 2, borderColor: palette.bordureForte },

  colDivider: { borderRightWidth: 1, borderRightColor: palette.bordure },
  colDividerLight: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.18)' },

  dirCell: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: palette.bordure,
  },
  dirCellBranlee: { backgroundColor: 'transparent', borderRightColor: 'rgba(255,255,255,0.18)' },
  dirText: { fontSize: 16, color: palette.encre },
  headDir: { borderTopLeftRadius: 4 },
  headDirText: { fontSize: 14, color: palette.bordureForte },

  // Matière crayon — la dernière manche d'une partie vivante : léger.
  rowCrayon: { backgroundColor: 'transparent' },
  // Matière gravé — le reste : un léger poids (teinte, gras).
  rowGrave: { backgroundColor: 'rgba(0,0,0,0.03)' },
  // La branlée pèse par-dessus, qu'elle soit sur du crayon ou du gravé : inversée, sombre.
  rowBranlee: { backgroundColor: matiere.grave.fond, borderColor: matiere.grave.fond },
  textInverse: { color: matiere.grave.encre },

  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  cumul: { fontSize: 18, fontWeight: '700', color: palette.score, textAlign: 'center' },
  legende: { ...typography.chrome, fontSize: 11, color: palette.bordureForte, textAlign: 'center', paddingVertical: 4 },

  headCell: { alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  headText: { fontSize: 15, fontWeight: '700', color: palette.encre },

  totalRow: { borderTopWidth: 2, borderColor: matiere.grave.fond, borderBottomWidth: 0, backgroundColor: matiere.grave.fond },
  totalDir: { backgroundColor: matiere.grave.fond },
  totalDirText: { fontSize: 11, fontWeight: '700', color: matiere.grave.encre, fontStyle: 'italic' },
  totalText: { fontSize: 22, fontWeight: '700', color: matiere.grave.encre },
});
