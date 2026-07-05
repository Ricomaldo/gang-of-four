/**
 * Pill d'identité d'un joueur (écran manche & démarrage).
 * Pastille couleur du siège + prénom (secondaire) + score cumulé en très gros
 * (élément dominant). En mode démarrage : pill vide et éditable.
 * Présentationnel — les valeurs viennent en props, aucune logique ici.
 */
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { palette, shapes } from '../theme/tokens';

type Props = {
  color: string;
  prenom: string;
  score: number;
  editable?: boolean;
  onChangePrenom?: (v: string) => void;
};

export function PlayerPill({ color, prenom, score, editable = false, onChangePrenom }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.idRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        {editable ? (
          <TextInput
            style={styles.nameInput}
            value={prenom}
            onChangeText={onChangePrenom}
            placeholder="prénom"
            placeholderTextColor={palette.bordureForte}
          />
        ) : (
          <Text style={styles.name}>{prenom}</Text>
        )}
      </View>
      {!editable && <Text style={styles.score}>{score}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: palette.fondPill,
    borderRadius: shapes.pillRadius,
    borderWidth: shapes.pillBorder,
    borderColor: palette.bordure,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  name: { color: palette.bordureForte, fontSize: 14 },
  nameInput: { color: palette.encre, fontSize: 16, minWidth: 90, paddingVertical: 2 },
  score: { color: palette.score, fontSize: 56, fontWeight: '700' },
});
