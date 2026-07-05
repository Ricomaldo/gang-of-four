/**
 * Pavé numérique unique (écran de saisie de fin de manche).
 * Chiffres 1–9, 0, effacer (⌫). La règle d'auto-avance (1 attend un 2e chiffre,
 * 0/2–9 valident direct) vit dans l'écran de saisie, pas ici : ce composant
 * ne fait qu'émettre les touches.
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette } from '../theme/tokens';

type Props = {
  onDigit: (d: number) => void;
  onBackspace: () => void;
};

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function NumPad({ onDigit, onBackspace }: Props) {
  return (
    <View style={styles.grid}>
      {KEYS.map((k) => (
        <TouchableOpacity key={k} style={styles.key} onPress={() => onDigit(k)}>
          <Text style={styles.label}>{k}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.key} />
      <TouchableOpacity style={styles.key} onPress={() => onDigit(0)}>
        <Text style={styles.label}>0</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.key} onPress={onBackspace}>
        <Text style={styles.label}>⌫</Text>
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
});
