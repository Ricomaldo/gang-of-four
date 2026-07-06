/**
 * Hub — composant-pivot à états, posé à l'intersection des 4 quadrants.
 * L'arc est la BORDURE du bouton : un ¾ de cercle (View circulaire, bord haut
 * transparent) terminé par une pointe de flèche tangente. Pas de SVG, pas d'emoji.
 * Réplique la méthode éprouvée du proto Claude Design (.cdisc2/.cring2/.chead2).
 * Le sens de jeu se lit sur l'arc : anti-horaire = défaut, horaire = miroir (scaleX).
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Direction } from '../domain/model';
import { palette } from '../theme/tokens';

export type HubState = 'ready' | 'enterScores' | 'roundEnd' | 'gofTriggered';

type Props = {
  state: HubState;
  direction: Direction;
  gofPlayerName?: string;
  disabled?: boolean;
  onPress: () => void;
};

const DISC = 128; // container (arc inclus)
const BTN = 88; // bouton central

export function Hub({ state, direction, gofPlayerName, disabled = false, onPress }: Props) {
  const label =
    state === 'gofTriggered' ? `GANG OF FOUR\n${gofPlayerName ?? ''}` :
    state === 'ready'        ? 'READY' :
    state === 'enterScores'  ? 'ENTRER\nSCORES' :
    'FIN DE\nMANCHE';

  const isDisabled = disabled || state === 'gofTriggered';
  // Manche 1 = anti-horaire = orientation par défaut ; horaire = arc en miroir.
  const mirrored = direction === 'anti-horaire';

  return (
    <TouchableOpacity
      style={[styles.disc, isDisabled && styles.discDisabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      accessibilityLabel={
        state === 'ready'       ? 'Prêt à démarrer' :
        state === 'enterScores' ? 'Saisir les scores' :
        'Fin de manche'
      }
    >
      {/* Couche arc-flèche (miroir horizontal pour le sens horaire) */}
      <View style={[styles.arrowLayer, mirrored && styles.arrowMirror]} pointerEvents="none">
        <View style={styles.ring} />
        <View style={styles.head} />
      </View>

      {/* Bouton central */}
      <View style={styles.btn}>
        <Text style={[styles.label, state === 'gofTriggered' && styles.gofLabel]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: DISC,
    height: DISC,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discDisabled: { opacity: 0.35 },

  arrowLayer: { position: 'absolute', width: DISC, height: DISC },
  arrowMirror: { transform: [{ scaleX: -1 }] },

  // ¾ de cercle : bord haut transparent → l'ouverture est en haut
  ring: {
    position: 'absolute',
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    borderWidth: 6,
    borderColor: palette.encre,
    borderTopColor: 'transparent',
  },
  // Pointe de flèche (triangle CSS) tangente au bout de l'arc, en haut-gauche
  head: {
    position: 'absolute',
    top: 9,
    left: 17,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderLeftWidth: 13,
    borderLeftColor: palette.encre,
    transform: [{ rotate: '-52deg' }],
  },

  btn: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    backgroundColor: palette.fondPill,
    borderWidth: 1.5,
    borderColor: palette.bordure,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11, textAlign: 'center', color: palette.encre, fontWeight: '700', lineHeight: 14 },
  gofLabel: { fontSize: 10 },
});
