/**
 * Hub — composant-pivot à états, posé à l'intersection des 4 quadrants.
 * Le bouton central seul : label d'état. Le sens de jeu vit désormais dans
 * <PlayDirection> (4 flèches autour du hub) — cf. retour Damien FD-07.
 * Pas de SVG, pas d'emoji (méthode proto Claude Design).
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { palette } from '../theme/tokens';

export type HubState = 'invite' | 'ready' | 'enterScores' | 'roundEnd' | 'gofTriggered';

type Props = {
  state: HubState;
  gofPlayerName?: string;
  disabled?: boolean;
  onPress: () => void;
};

const DISC = 128; // container
const BTN = 88; // bouton central

export function Hub({ state, gofPlayerName, disabled = false, onPress }: Props) {
  const label =
    state === 'gofTriggered' ? `GANG OF FOUR\n${gofPlayerName ?? ''}` :
    state === 'ready'        ? 'READY' :
    state === 'enterScores'  ? 'ENTRER\nSCORES' :
    'FIN DE\nMANCHE';

  const isDisabled = disabled || state === 'gofTriggered';

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
