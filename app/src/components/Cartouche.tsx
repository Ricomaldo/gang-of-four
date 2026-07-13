/* ═══ RESHAPE 0.2 · TAG [N] neuf ═══
 * Cible : la voix calme, persistante — « {prénom} mène ».
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md §battement (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Cartouche — fine ligne persistante en haut du Round, le murmure (cf. reshape
 * §3 La voix → trois surfaces). Texte seul, change sans animation. Reste monté
 * même vide (le texte peut être une chaîne vide) pour ne jamais faire sauter
 * le layout cartouche/plateau/zone du bas.
 */
import { StyleSheet, Text, View } from 'react-native';
import { palette, typography } from '../theme/tokens';

export function Cartouche({ text }: { text: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text} numberOfLines={1}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' },
  text: { ...typography.chrome, fontSize: 12, color: palette.bordureForte },
});
