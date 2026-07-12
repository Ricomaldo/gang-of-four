/* ═══ RESHAPE 0.2 · TAG [†] supprimé ═══
 * Cible : les pills du plateau sont la cible de saisie.
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Rangée horizontale de 4 sélecteurs (écran de saisie), gauche → droite dans
 * l'ordre des sièges : pastille couleur + initiale seule (B / D / F / J).
 * Chaque sélecteur affiche en direct la valeur en cours de saisie pour ce joueur.
 * Présentationnel : la cible active et les valeurs viennent en props.
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { PlayerId } from '../domain/model';
import { palette } from '../theme/tokens';

type Seat = { id: PlayerId; color: string; initial: string; value: string };

type Props = {
  seats: Seat[];
  activeId: PlayerId;
  onSelect: (id: PlayerId) => void;
};

export function SeatSelectors({ seats, activeId, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {seats.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={[styles.cell, s.id === activeId && styles.active]}
          onPress={() => onSelect(s.id)}
        >
          <View style={styles.head}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.initial}>{s.initial}</Text>
          </View>
          <Text style={styles.value}>{s.value || '–'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cell: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: palette.bordure,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 6,
  },
  active: { borderColor: palette.accentSaisie, borderWidth: 2.5 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  initial: { fontSize: 16, color: palette.encre, fontWeight: '600' },
  value: { fontSize: 22, color: palette.score },
});
