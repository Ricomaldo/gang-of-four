/* ═══ RESHAPE 0.2 · TAG [H] hérité ═══
 * Cible : le plateau.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * QuadrantGrid — l'assemblage 2×2 partagé par l'écran de setup et l'écran de manche.
 * Deux rangées de cadrans + un overlay centré (le Gong, ou la carte de fin de partie)
 * posé à l'intersection. Garantit que setup et jeu partagent EXACTEMENT le même layout.
 *
 * `cells` : 4 nœuds déjà emballés (typiquement <Quadrant><PlayerPill/></Quadrant>),
 *   dans l'ordre [haut-gauche, haut-droite, bas-gauche, bas-droite].
 * `overlay` : le contenu central (box-none pour laisser passer les touches ailleurs).
 */
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  cells: [ReactNode, ReactNode, ReactNode, ReactNode];
  overlay?: ReactNode;
};

export function QuadrantGrid({ cells, overlay }: Props) {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        {cells[0]}
        {cells[1]}
      </View>
      <View style={styles.row}>
        {cells[2]}
        {cells[3]}
      </View>
      {overlay != null && (
        <View style={styles.overlay} pointerEvents="box-none">
          {overlay}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flex: 1, padding: 8 },
  row: { flex: 1, flexDirection: 'row' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
