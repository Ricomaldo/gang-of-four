/**
 * PlayDirection — le sens de jeu montré par UNE flèche, dans le gap du bas (entre
 * les deux joueurs du bas), lue à l'endroit par le proprio du téléphone qui note.
 * Comme sur la feuille papier : une seule flèche devant le noteur, les autres se déduisent.
 *
 * Remplace les 4 flèches tangentes autour du hub (décision Eric) : plus grande, posée
 * au milieu de la hauteur du cadran du bas, pas collée au centre.
 *
 * Sens dérivé de directionOfPlay (domain) : manche 1 = anti-horaire, puis alternance.
 * Base du triangle = pointe vers la DROITE (0°). Gap du bas : horaire = pointe à gauche
 * (180°), anti-horaire = pointe à droite (0°) — mapping Sud déjà validé (FD-07).
 * Pas de SVG, pas d'emoji — triangle CSS (méthode proto Claude Design, cf. Hub).
 */
import { StyleSheet, View } from 'react-native';
import type { Direction } from '../domain/model';
import { palette } from '../theme/tokens';

const AH = 13; // demi-hauteur du triangle (un peu plus grand qu'avant)
const AW = 20; // longueur jusqu'à la pointe

export function PlayDirection({ direction }: { direction: Direction }) {
  const rotate = direction === 'horaire' ? '180deg' : '0deg';
  return (
    <View style={styles.layer} pointerEvents="none">
      <View style={styles.slot}>
        <View style={[styles.arrow, { transform: [{ rotate }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  // Bande du bas, centrée verticalement dans le cadran du bas (~75 % de la hauteur).
  slot: { position: 'absolute', top: '73%', left: 0, right: 0, alignItems: 'center' },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: AH,
    borderBottomWidth: AH,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftWidth: AW,
    borderLeftColor: palette.encre,
  },
});
