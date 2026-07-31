/* ═══ RESHAPE 0.2 · TAG [R] reshapé — LE PLACARD ═══
 * Cible : la voix calme, persistante — la bande noire pleine largeur (§04/§05 spec placard).
 * Lot : lot 1 → placard — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : GANG - Specs placard §Accueil/§Round · specs-ecrans.md §battement (fait foi).
 * ═══════════════════════════════ */
/**
 * Cartouche — la fine ligne persistante en haut (accueil ET Round), le murmure.
 * Placard : bande NOIRE pleine largeur, mono crème, centré, letter-spacing. Reste
 * monté même vide (ne jamais faire sauter le layout cartouche/plateau/zone).
 *
 * `accent` (optionnel) — le nom du meneur sur le Round, en AMBRE (le seul chaud
 * toléré ici, car le Round est le vivant). L'accueil ne le passe pas : crème only.
 */
import { StyleSheet, Text, View } from 'react-native';
import { palette, typography } from '../theme/tokens';

export function Cartouche({ text, accent }: { text: string; accent?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text} numberOfLines={1}>
        {accent ? <Text style={styles.accent}>{accent} </Text> : null}
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: palette.encre, paddingVertical: 11, paddingHorizontal: 16, alignItems: 'center' },
  text: { ...typography.chrome, fontSize: 13, letterSpacing: 2, color: palette.cremePage, textAlign: 'center' },
  accent: { ...typography.chrome, letterSpacing: 2, color: palette.ambre },
});
