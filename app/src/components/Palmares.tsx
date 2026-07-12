/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : absorbé par LA STÈLE : 2 trônes + détail + branlées + mention GOF + partager.
 * Lot : lot 3 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Palmares — scoreboard de la SOIRÉE (plus la portée partie).
 * Agrège par prénom sur les parties terminées : 4 compteurs (⭐️ 💥 🏆 ❌) + 2 titres
 * à porteur unique (Leader ✌️, Looser 🐌). Zone présentationnelle : dérive tout via
 * computeSoireeStats, ne stocke rien. La liste est variable (tous les prénoms du soir).
 *
 * Pas de couleur par personne : la couleur est liée au SIÈGE, pas au joueur (tokens),
 * et un même prénom a pu changer de siège entre deux parties. Le prénom est l'identité.
 *
 * La mise en forme fine (grille, couronnes) reste le terrain de design d'Eric — ici,
 * un tableau sobre et juste.
 */
import { StyleSheet, Text, View } from 'react-native';
import type { GameArchive } from '../domain/model';
import { computeSoireeStats } from '../domain/stats';
import { palette } from '../theme/tokens';

export function Palmares({ parties }: { parties: GameArchive[] }) {
  const { parPrenom, leader, looser } = computeSoireeStats(parties);

  if (parPrenom.length === 0) {
    return (
      <View style={styles.palmares}>
        <Text style={styles.title}>Palmarès de la soirée</Text>
        <Text style={styles.empty}>Le palmarès s'ouvre après la première partie 🏆</Text>
      </View>
    );
  }

  return (
    <View style={styles.palmares}>
      <Text style={styles.title}>Palmarès de la soirée</Text>

      {/* En-tête colonnes */}
      <View style={[styles.row, styles.headRow]}>
        <Text style={[styles.name, styles.headText]} />
        <Text style={[styles.stat, styles.headText]}>⭐️</Text>
        <Text style={[styles.stat, styles.headText]}>💥</Text>
        <Text style={[styles.stat, styles.headText]}>🏆</Text>
        <Text style={[styles.stat, styles.headText]}>❌</Text>
      </View>

      {parPrenom.map((p) => {
        const titre = p.prenom === leader ? ' ✌️' : p.prenom === looser ? ' 🐌' : '';
        return (
          <View key={p.prenom} style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>
              {p.prenom}
              {titre}
            </Text>
            <Text style={styles.stat}>{p.manchesGagnees}</Text>
            <Text style={styles.stat}>{p.manchesPerdues}</Text>
            <Text style={styles.stat}>{p.partiesGagnees}</Text>
            <Text style={styles.stat}>{p.partiesPerdues}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  palmares: { marginTop: 28, borderTopWidth: 1, borderColor: palette.bordure, paddingTop: 16 },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.bordureForte,
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  headRow: { borderBottomWidth: 1, borderColor: palette.bordure, paddingBottom: 8, marginBottom: 2 },
  name: { flex: 1, fontSize: 15, color: palette.encre, fontWeight: '600' },
  stat: { width: 44, textAlign: 'center', fontSize: 16, color: palette.encre },
  headText: { fontSize: 14 },
  empty: { color: palette.bordureForte, fontSize: 13, paddingVertical: 12, textAlign: 'center' },
});
