/* ═══ RESHAPE 0.2 · TAG [H] hérité ═══
 * Cible : RÉINTÉGRÉ autour du Gong (absent des planches CD — il ne disparaît pas).
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * PlayDirection — le sens de jeu montré par UNE flèche, dans le gap du bas (entre
 * les deux joueurs du bas), lue à l'endroit par le proprio du téléphone qui note.
 * Comme sur la feuille papier : une seule flèche devant le noteur, les autres se déduisent.
 *
 * Flèche FRANCHE (hampe + tête), posée dans sa bande dédiée SOUS les quadrants
 * (hors du plateau, cf. RoundScreen dirBand). Remplace les 4 flèches tangentes
 * autour du hub (décision Eric).
 *
 * Sens dérivé de directionOfPlay (domain) : manche 1 = anti-horaire, puis alternance.
 * Tête vers la DROITE au repos (0°). Gap du bas : horaire = pointe à gauche (180°),
 * anti-horaire = pointe à droite (0°) — mapping Sud déjà validé (FD-07).
 * Pas de SVG, pas d'emoji — formes CSS (méthode proto Claude Design, cf. Hub).
 *
 * Rendu INLINE : centré dans son conteneur (la bande porte le placement), plus
 * d'auto-positionnement absolu.
 */
import { StyleSheet, View } from 'react-native';
import type { Direction } from '../domain/model';
import { palette } from '../theme/tokens';

export function PlayDirection({ direction }: { direction: Direction }) {
  const rotate = direction === 'horaire' ? '180deg' : '0deg';
  return (
    <View style={[styles.arrow, { transform: [{ rotate }] }]} pointerEvents="none">
      <View style={styles.shaft} />
      <View style={styles.head} />
    </View>
  );
}

const styles = StyleSheet.create({
  arrow: { flexDirection: 'row', alignItems: 'center' },
  shaft: {
    width: 26,
    height: 9,
    borderRadius: 2,
    backgroundColor: palette.bordureForte,
    marginRight: -1, // colle la hampe à la tête, pas de trou
  },
  head: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftWidth: 20,
    borderLeftColor: palette.bordureForte,
  },
});
