/* ═══ RESHAPE 0.2 · TAG [N] neuf ═══
 * Cible : la voix éclat — cérémonie branlée + final, les 2 surdominants de l'échelle.
 * Lot : lot 2 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md §Les annonces · signature/reshape.md §battement ④
 *   · signature/branlee.md §La cérémonie (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Annonce — la couche surdominante, montée au-dessus de `plateauZone` (Round).
 * Ne porte que les 2 intensités gatées de l'échelle (rareté = intensité) :
 *  - cérémonie (la branlée) : le plateau se fige, dialogue à 2 sorties
 *    (corriger = crayon, réversible / graver = gravé, scellé).
 *  - final (la partie finie) : miroir gloire/💩. L'asymétrie du son est une
 *    exigence sémantique (gloire = son, honte = silence), pas du polish —
 *    asset placeholder autorisé (réutilise gofSound).
 * Rendu volontairement ossature : le rendu fin (easing, particules, assets
 * sonores définitifs) est parqué au lot 4.
 */
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createAudioPlayer } from 'expo-audio';
import { palette, typography } from '../theme/tokens';
import { nextGofSoundIndex } from './gofSound';

const SOUNDS = [
  require('../../assets/sounds/gof-01.mp3'),
  require('../../assets/sounds/gof-02.mp3'),
  require('../../assets/sounds/gof-03.mp3'),
];

type Props =
  | {
      kind: 'ceremonie';
      intensite: 'petite' | 'grosse';
      donneur: string;
      onCorriger: () => void;
      onGraver: () => void;
    }
  | {
      kind: 'final';
      vainqueur: string;
      dernier: string;
      onRejouer: () => void;
    };

export function Annonce(props: Props) {
  useEffect(() => {
    if (props.kind !== 'final') return;
    const player = createAudioPlayer(SOUNDS[nextGofSoundIndex(SOUNDS.length)]);
    player.play();
    return () => player.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.kind]);

  if (props.kind === 'ceremonie') {
    const titre = props.intensite === 'grosse' ? 'grosse branlée' : 'petite branlée';
    return (
      <View style={styles.overlay} pointerEvents="auto">
        <Text style={styles.titre}>{titre} de {props.donneur} !</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.ghost} onPress={props.onCorriger}>
            <Text style={styles.ghostText}>corriger</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.plein} onPress={props.onGraver}>
            <Text style={styles.pleinText}>graver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.miroir}>
        <View style={styles.gloire}>
          <Text style={styles.gloireEmoji}>🏆</Text>
          <Text style={styles.gloireTitre}>{props.vainqueur} gagne la partie</Text>
        </View>
        <View style={styles.honte}>
          <Text style={styles.honteEmoji}>💩</Text>
          <Text style={styles.honteTitre}>{props.dernier} ramasse le 💩</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.plein} onPress={props.onRejouer}>
        <Text style={styles.pleinText}>on rejoue ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(26,26,26,0.92)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 16,
  },
  titre: { ...typography.proclaim, fontSize: 22, color: palette.fondCreme, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 12 },
  ghost: { borderWidth: 1.5, borderColor: palette.fondCreme, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
  ghostText: { ...typography.chrome, color: palette.fondCreme, fontSize: 13 },
  plein: { backgroundColor: palette.fondCreme, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  pleinText: { ...typography.proclaim, color: palette.encre, fontSize: 15 },
  miroir: { flexDirection: 'row', gap: 24 },
  gloire: { alignItems: 'center', gap: 6 },
  gloireEmoji: { fontSize: 44 },
  gloireTitre: { ...typography.proclaim, fontSize: 16, color: palette.fondCreme, textAlign: 'center', maxWidth: 130 },
  honte: { alignItems: 'center', gap: 6, opacity: 0.7 },
  honteEmoji: { fontSize: 36 },
  honteTitre: { ...typography.chrome, fontSize: 13, color: palette.fondCreme, textAlign: 'center', maxWidth: 130 },
});
