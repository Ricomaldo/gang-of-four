/* ═══ RESHAPE 0.2 · TAG [R] reshapé — LE PLACARD ═══
 * Cible : la cellule du plateau — cadre encre sur crème ; le MENEUR = cellule
 * remplie orange (le seul chaud du plateau, cf. règle d'or). Le contenu (prénom
 * + total) vit dans la PlayerPill passée en children.
 * Specs : GANG - Specs placard §Round (fait foi).
 * ═══════════════════════════════ */
/**
 * Quadrant — l'ossature répétée du plateau : une cellule bordée qui accueille en
 * son sein une zone d'affichage (PlayerPill). Un seul rôle : le contenant. Il ne
 * connaît rien du joueur SAUF s'il mène (`leader` → cellule orange, le projecteur).
 * `align` gère la contrainte keyboard-safe du setup (pills du bas remontées vers
 * la médiane pendant la saisie, centrées ensuite).
 */
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { palette, shapes } from '../theme/tokens';

type Props = {
  children: ReactNode;
  align?: 'center' | 'top' | 'bottom';
  /** Le meneur : la cellule s'allume orange (le projecteur suit le cumul le plus bas). */
  leader?: boolean;
  /** Pendant la frime GoF : le quadrant recule (dim + ratatiné). */
  recede?: boolean;
};

const ALIGN = {
  center: 'center',
  top: 'flex-start',
  bottom: 'flex-end',
} as const;

export function Quadrant({ children, align = 'center', leader = false, recede = false }: Props) {
  // Le gagnant prend toute la lumière : les autres s'assombrissent et se ratatinent.
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(t, { toValue: recede ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [recede, t]);

  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });
  const opacity = t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] });

  return (
    <View style={[styles.quadrant, leader && styles.quadrantLeader, { justifyContent: ALIGN[align] }]}>
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
    borderRadius: 6,
    borderWidth: shapes.trait,
    borderColor: palette.encre,
    backgroundColor: palette.cremeRelief,
    alignItems: 'center',
    paddingVertical: 10,
  },
  // Le meneur : cellule remplie orange (ex-rouge, jugé trop criard le 09/08 —
  // on descend vers le chaud du design color, moins agressif). Le texte crème
  // de la PlayerPill reste lisible dessus.
  quadrantLeader: { backgroundColor: palette.orange, borderColor: palette.orange },
  inner: { alignSelf: 'stretch', flex: 1, alignItems: 'center' },
});
