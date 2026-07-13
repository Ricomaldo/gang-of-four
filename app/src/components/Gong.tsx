/* ═══ RESHAPE 0.2 · TAG [N] neuf — remplace Hub.tsx [†] ═══
 * Cible : l'objet-voix central du Round — l'asset gang-of-four.webp (le logo
 * du JEU, il ne vit qu'ici). Tap → la frime (câblée côté RoundScreen).
 * Lot : lot 4 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-anim-frime.md · signature/frime.md ·
 *   specs-ecrans.md §Le thème (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Gong — posé à l'interstice des 4 quadrants (overlay de QuadrantGrid). Un
 * seul rôle : le tap. Ni état ni logique de jeu ici — RoundScreen décide ce
 * que « tap » déclenche (la frime + gofCount++) et le désactive pendant.
 * Le rendu fin (matière pierre/chaleur réglée) est le geste d'Eric — cf.
 * theme/tokens (`chaleur`).
 */
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { chaleur, shapes } from '../theme/tokens';

const GOF_IMAGE = require('../../assets/official/gang-of-four.webp');

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const DISC = shapes.discSize + shapes.discBorder * 4; // container — le tap est plus généreux que l'image

export function Gong({ onPress, disabled = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.disc, disabled && styles.discDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityLabel="Gang of Four"
    >
      <Image source={GOF_IMAGE} resizeMode="contain" style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    borderWidth: shapes.discBorder / 2,
    borderColor: chaleur.braise,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discDisabled: { opacity: 0.35 },
  image: { width: shapes.discSize, height: shapes.discSize },
});
