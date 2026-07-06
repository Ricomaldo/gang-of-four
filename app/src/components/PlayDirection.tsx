/**
 * PlayDirection — le sens de jeu montré par 4 flèches tangentielles autour du hub,
 * une par « gap » entre joueurs, tournant dans le sens du cycle de table.
 * Remplace l'arc central : affordance plus lisible (retour Damien FD-07).
 *
 * Sens dérivé de directionOfPlay (domain) : manche 1 = anti-horaire, puis alternance.
 * Cycle horaire de la table (TABLE_SEATS) : HG(0)→HD(1)→BD(3)→BG(2). Vu comme un anneau
 * autour du centre : horaire = N pointe à droite, E vers le bas, S à gauche, O vers le haut.
 * Pas de SVG, pas d'emoji — triangles CSS (méthode proto Claude Design, cf. Hub).
 */
import { StyleSheet, View } from 'react-native';
import type { Direction } from '../domain/model';
import { palette } from '../theme/tokens';

const BOX = 200; // couche centrée sur le hub
const AH = 9; // demi-hauteur du triangle
const AW = 14; // longueur jusqu'à la pointe

// Rotation de chaque flèche — base = pointe vers la DROITE (0°) — par position
// cardinale et sens de circulation. Anti-horaire = l'exact inverse de l'horaire.
const ROTATION: Record<Direction, { n: number; e: number; s: number; w: number }> = {
  horaire: { n: 0, e: 90, s: 180, w: 270 },
  'anti-horaire': { n: 180, e: 270, s: 0, w: 90 },
};

export function PlayDirection({ direction }: { direction: Direction }) {
  const r = ROTATION[direction];
  return (
    <View style={styles.layer} pointerEvents="none">
      <View style={[styles.arrow, styles.north, { transform: [{ rotate: `${r.n}deg` }] }]} />
      <View style={[styles.arrow, styles.east, { transform: [{ rotate: `${r.e}deg` }] }]} />
      <View style={[styles.arrow, styles.south, { transform: [{ rotate: `${r.s}deg` }] }]} />
      <View style={[styles.arrow, styles.west, { transform: [{ rotate: `${r.w}deg` }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { position: 'absolute', width: BOX, height: BOX },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: AH,
    borderBottomWidth: AH,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftWidth: AW,
    borderLeftColor: palette.encre,
  },
  north: { top: 6, left: (BOX - AW) / 2 },
  south: { bottom: 6, left: (BOX - AW) / 2 },
  east: { right: 6, top: (BOX - AH * 2) / 2 },
  west: { left: 6, top: (BOX - AH * 2) / 2 },
});
