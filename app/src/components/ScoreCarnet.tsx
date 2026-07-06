/**
 * ScoreCarnet — la table du carnet officiel (zone « grille »).
 * Colonnes = joueurs (pastille + initiale) ; colonne gauche ombrée = sens de jeu.
 * Chaque cellule = le CUMUL du joueur à cette manche (gros, dominant) + le score de
 * la manche (petit, à gauche). Cellule gagnante (manche à 0) = fond teinté couleur.
 * Ligne TOT = cumul final, fond noir / texte blanc.
 *
 * Zone présentationnelle : dérive tout de l'archive, ne stocke rien.
 */
import { StyleSheet, Text, View } from 'react-native';
import { PLAYER_IDS } from '../domain/model';
import type { GameArchive, PlayerId } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeRoundScore, computeTotals } from '../domain/scoring';
import { roundWinner } from '../domain/winner';
import { palette, seatColors } from '../theme/tokens';

export function ScoreCarnet({ archive }: { archive: GameArchive }) {
  const { players, rounds } = archive;
  const totals = computeTotals(rounds);

  // Cumul progressif par joueur, manche après manche.
  const running: Record<PlayerId, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const rows = rounds.map((r, i) => {
    const winner = roundWinner(r);
    const cells = PLAYER_IDS.map((id) => {
      const pts = computeRoundScore(r.cardCounts[id]);
      running[id] += pts;
      return { id, pts, cumul: running[id], isWinner: id === winner };
    });
    return { i, direction: directionOfPlay(i + 1), cells };
  });

  return (
    <View style={styles.carnet}>
      {/* En-tête colonnes */}
      <View style={[styles.row, styles.headRow]}>
        <View style={[styles.dirCell, styles.headDir]}>
          <Text style={styles.headDirText}>↔</Text>
        </View>
        {PLAYER_IDS.map((id) => (
          <View key={id} style={[styles.cell, styles.headCell]}>
            <View style={[styles.dot, { backgroundColor: seatColors[id] }]} />
            <Text style={styles.headText}>{(players[id].prenom[0] ?? '?').toUpperCase()}</Text>
          </View>
        ))}
      </View>

      {rows.length === 0 ? (
        <Text style={styles.empty}>Aucune manche jouée.</Text>
      ) : (
        rows.map((row) => (
          <View key={row.i} style={styles.row}>
            <View style={styles.dirCell}>
              <Text style={styles.dirText}>{row.direction === 'anti-horaire' ? '←' : '→'}</Text>
            </View>
            {row.cells.map((c) => (
              <View
                key={c.id}
                style={[styles.cell, c.isWinner && { backgroundColor: seatColors[c.id] + '22' }]}
              >
                <Text style={[styles.roundPts, c.isWinner && styles.roundPtsWinner]}>{c.pts}</Text>
                <Text style={styles.cumul}>{c.cumul}</Text>
              </View>
            ))}
          </View>
        ))
      )}

      {/* Ligne TOT — cumul final, fond noir */}
      <View style={[styles.row, styles.totalRow]}>
        <View style={[styles.dirCell, styles.totalDir]}>
          <Text style={styles.totalDirText}>TOT</Text>
        </View>
        {PLAYER_IDS.map((id) => (
          <View key={id} style={styles.cell}>
            <Text style={styles.totalText}>{totals[id]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carnet: {},
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: palette.bordure },
  headRow: { borderBottomWidth: 2, borderColor: palette.bordureForte },

  // Colonne sens — ombrée (proto .dircell)
  dirCell: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 10,
  },
  dirText: { fontSize: 16, color: palette.encre },
  headDir: { borderTopLeftRadius: 4 },
  headDirText: { fontSize: 14, color: palette.bordureForte },

  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  roundPts: { fontSize: 11, color: palette.bordureForte, minWidth: 14, textAlign: 'right' },
  roundPtsWinner: { color: palette.encre, fontWeight: '700' },
  cumul: { fontSize: 20, fontWeight: '700', color: palette.score, minWidth: 26, textAlign: 'left' },

  headCell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  headText: { fontSize: 18, fontWeight: '700', color: palette.encre },
  dot: { width: 14, height: 14, borderRadius: 7 },

  totalRow: { borderTopWidth: 2, borderColor: palette.encre, borderBottomWidth: 0, backgroundColor: palette.encre },
  totalDir: { backgroundColor: palette.encre },
  totalDirText: { fontSize: 11, fontWeight: '700', color: palette.fondCreme, fontStyle: 'italic' },
  totalText: { fontSize: 22, fontWeight: '700', color: palette.fondCreme },

  empty: { textAlign: 'center', color: palette.bordureForte, paddingVertical: 24 },
});
