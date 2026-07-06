/**
 * Palmares — zone « tableau d'honneur », séparée du carnet.
 * Les manches gagnées par joueur : ce n'est pas le carnet (scores), c'est le palmarès.
 * Panneau distinct pour qu'Eric puisse le styler isolément.
 */
import { StyleSheet, Text, View } from 'react-native';
import { PLAYER_IDS } from '../domain/model';
import type { GameArchive } from '../domain/model';
import { manchesGagnees } from '../domain/winner';
import { palette, seatColors } from '../theme/tokens';

export function Palmares({ archive }: { archive: GameArchive }) {
  const { players, rounds } = archive;
  const victoires = manchesGagnees(rounds);

  return (
    <View style={styles.palmares}>
      <Text style={styles.title}>Palmarès — manches gagnées</Text>
      <View style={styles.rowItems}>
        {PLAYER_IDS.map((id) => (
          <View key={id} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: seatColors[id] }]} />
            <Text style={styles.name}>{(players[id].prenom || '?').slice(0, 6)}</Text>
            <Text style={styles.count}>{victoires[id]}</Text>
          </View>
        ))}
      </View>
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
  rowItems: { flexDirection: 'row', justifyContent: 'space-around' },
  item: { alignItems: 'center', gap: 4 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  name: { fontSize: 11, color: palette.bordureForte },
  count: { fontSize: 24, fontWeight: '700', color: palette.encre },
});
