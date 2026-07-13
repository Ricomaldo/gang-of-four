/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : numpad-calculette 3×4 : 0-9 · del · « = » (actif à 4/4, un seul 0).
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Pavé numérique-calculette (zone du bas, état SAISIR). Chiffres 1–9, del, 0, « = ».
 * Le « = » EST le valider : il déclenche le calcul, actif seulement à 4/4 saisis
 * (garde d'entrée déléguée à l'appelant via `canValidate`, cf. domain/winner
 * isValidRoundInput). Ce composant n'émet que les touches, aucune règle ici.
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette, typography } from '../theme/tokens';

type Props = {
  onDigit: (d: number) => void;
  onBackspace: () => void;
  onValidate: () => void;
  canValidate: boolean;
};

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function NumPad({ onDigit, onBackspace, onValidate, canValidate }: Props) {
  return (
    <View style={styles.grid}>
      {KEYS.map((k) => (
        <TouchableOpacity key={k} style={styles.key} onPress={() => onDigit(k)}>
          <Text style={styles.label}>{k}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.key} onPress={onBackspace}>
        <Text style={styles.label}>⌫</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.key} onPress={() => onDigit(0)}>
        <Text style={styles.label}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.key, styles.equals, !canValidate && styles.equalsOff]}
        onPress={onValidate}
        disabled={!canValidate}
      >
        <Text style={[styles.label, styles.equalsLabel]}>=</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  key: {
    width: '30%',
    aspectRatio: 1.6,
    margin: '1.5%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.bordure,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 30, color: palette.encre },
  equals: { backgroundColor: palette.encre, borderColor: palette.encre },
  equalsOff: { opacity: 0.3 },
  equalsLabel: { ...typography.proclaim, color: palette.fondCreme },
});
