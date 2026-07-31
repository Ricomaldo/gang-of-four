/* ═══ RESHAPE 0.2 · TAG [N] neuf — remplace Hub.tsx [†] · LE PLACARD ═══
 * Cible : l'objet-voix central du Round — l'asset gang-of-four.webp (le logo du
 * JEU, il ne vit qu'ici). Placard §Round : disque fond crème-relief, bord noir,
 * HALO ORANGÉ. Tap → la frime (câblée côté RoundScreen).
 * Specs : GANG - Specs placard §Round · specs-anim-frime.md · signature/frime.md.
 * ═══════════════════════════════ */
/**
 * Gong — posé à l'interstice des 4 quadrants (overlay de QuadrantGrid). Un seul
 * rôle : le tap. Ni état ni logique de jeu ici — RoundScreen décide ce que « tap »
 * déclenche (la frime + gofCount++) et le désactive pendant.
 *
 * Le halo orangé est un `shadowColor` (rendu propre sur iOS ; Android dégrade en
 * ombre neutre via `elevation` — pas de glow coloré natif). C'est le seul point
 * où RN ne rend pas le placard au pixel ; le reste (fond, bord, logo) est fidèle.
 */
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { palette } from '../theme/tokens';

const GOF_IMAGE = require('../../assets/official/gang-of-four.webp');

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const DISC = 150;
const BORDER = 5;

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
    borderWidth: BORDER,
    borderColor: palette.encre,
    backgroundColor: palette.cremeRelief,
    alignItems: 'center',
    justifyContent: 'center',
    // Le halo orangé (0 0 36px rgba(224,107,26,.45) → shadow RN).
    shadowColor: palette.orange,
    shadowOpacity: 0.55,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  discDisabled: { opacity: 0.35 },
  image: { width: DISC * 0.72, height: DISC * 0.72 },
});
