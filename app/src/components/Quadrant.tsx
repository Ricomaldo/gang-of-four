/**
 * Quadrant — l'ossature répétée de l'écran de manche : un cadran bordé à coins
 * ronds (proto Claude Design) qui accueille en son sein une zone d'affichage (PlayerPill).
 *
 * Un seul rôle : le contenant. Il ne connaît rien du joueur — la pill est passée
 * en children. `align` gère la contrainte keyboard-safe du setup (pills du bas
 * remontées vers la médiane pendant la saisie, centrées ensuite).
 */
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { palette } from '../theme/tokens';

type Props = {
  children: ReactNode;
  align?: 'center' | 'top' | 'bottom';
  /** Pendant la frime GoF d'un autre joueur : le quadrant recule (dim + ratatiné). */
  recede?: boolean;
};

const ALIGN = {
  center: 'center',
  top: 'flex-start',
  bottom: 'flex-end',
} as const;

export function Quadrant({ children, align = 'center', recede = false }: Props) {
  // Le gagnant prend toute la lumière : les autres s'assombrissent et se ratatinent.
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(t, { toValue: recede ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [recede, t]);

  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });
  const opacity = t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] });

  return (
    <View style={[styles.quadrant, { justifyContent: ALIGN[align] }]}>
      <Animated.View style={[styles.inner, { justifyContent: ALIGN[align] }, { transform: [{ scale }], opacity }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  quadrant: {
    flex: 1,
    margin: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: palette.fondPill,
    backgroundColor: palette.fondPill,
    alignItems: 'center',
    paddingVertical: 12,
  },
  inner: { alignSelf: 'stretch', flex: 1, alignItems: 'center' },
});
