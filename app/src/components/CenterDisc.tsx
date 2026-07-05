/**
 * Disque central « FIN DE MANCHE » (écran manche).
 * Sa bordure porte le sens de jeu (arc ~¾ + flèche courbe), mis en miroir à chaque
 * manche. Ici : placeholder présentationnel — l'arc/flèche définitif est du travail
 * de design ultérieur ; on n'affiche que le disque et le label, plus le sens en texte.
 */
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { Direction } from '../domain/model';
import { palette, shapes } from '../theme/tokens';

type Props = {
  direction: Direction;
  /** 'start' avant toute manche saisie (point d'info d'état) ; 'round' ensuite (geste de saisie). */
  phase: 'start' | 'round';
  onPress: () => void;
};

export function CenterDisc({ direction, phase, onPress }: Props) {
  const start = phase === 'start';
  return (
    <TouchableOpacity
      style={styles.disc}
      onPress={onPress}
      accessibilityLabel={start ? 'Démarrer la partie' : 'Fin de manche'}
    >
      <Text style={styles.arrow}>{direction === 'anti-horaire' ? '↺' : '↻'}</Text>
      <Text style={styles.label}>{start ? 'START\nGAME ?' : 'FIN DE\nMANCHE'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: shapes.discSize,
    height: shapes.discSize,
    borderRadius: shapes.discSize / 2,
    borderWidth: shapes.discBorder,
    borderColor: palette.encre,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.fondCreme,
  },
  arrow: { fontSize: 22, color: palette.encre },
  label: { fontSize: 11, textAlign: 'center', color: palette.encre, fontWeight: '600' },
});
