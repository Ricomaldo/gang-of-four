/**
 * Quadrant — l'ossature répétée de l'écran de manche : un cadran bordé à coins
 * ronds (proto Claude Design) qui accueille en son sein une zone d'affichage (PlayerPill).
 *
 * Un seul rôle : le contenant. Il ne connaît rien du joueur — la pill est passée
 * en children. `align` gère la contrainte keyboard-safe du setup (pills du bas
 * remontées vers la médiane pendant la saisie, centrées ensuite).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { palette } from '../theme/tokens';

type Props = {
  children: ReactNode;
  align?: 'center' | 'top' | 'bottom';
  marginVertical?: number;
};

const ALIGN = {
  center: 'center',
  top: 'flex-start',
  bottom: 'flex-end',
} as const;

export function Quadrant({ children, align = 'center' }: Props) {
  return (
    <View style={[styles.quadrant, { justifyContent: ALIGN[align] }]}>
      {children}
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
});
