/* ═══ RESHAPE 0.2 · TAG [N] neuf — LE PLACARD ═══
 * Cible : la voix éclat — cérémonie branlée + final, les 2 surdominants de l'échelle.
 * Placard : la gloire = l'inverse + la lumière + le plus gros corps, AUCUN glyphe ;
 * la honte = le silence + le creux + ☞, plus bas, plus petit, gris. Miroir INÉGAL.
 * Specs : GANG - Specs placard §Round(annonces)/§Typo · signature/branlee.md §La cérémonie.
 *
 * `kind: 'final'` porte « corriger » (optionnel — seulement si la manche gagnante
 * est corrigeable), « consulter » (→ stèle) et « on rejoue ? ». L'asymétrie du son
 * (gloire = son, honte = silence) est sémantique, pas du polish.
 * ═══════════════════════════════ */
/**
 * Annonce — la couche surdominante, montée au-dessus de `plateauZone` (Round).
 * Deux intensités gatées (rareté = intensité) : la cérémonie (branlée, 2 sorties
 * corriger/graver) et le final (miroir gloire/honte + 3 portes).
 */
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createAudioPlayer } from 'expo-audio';
import { fonts, matiere, palette, typography } from '../theme/tokens';
import { nextGofSoundIndex } from './gofSound';
import { GONG_SOUNDS } from './gongSounds';

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
      /** Absent si la manche gagnante n'est pas corrigeable (branlée gravée). */
      onCorriger?: () => void;
      onConsulter: () => void;
    };

export function Annonce(props: Props) {
  useEffect(() => {
    // La gloire prend le SON (le rugissement) ; la honte prend le silence.
    if (props.kind !== 'final') return;
    const player = createAudioPlayer(GONG_SOUNDS[nextGofSoundIndex(GONG_SOUNDS.length)]);
    player.play();
    return () => player.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.kind]);

  if (props.kind === 'ceremonie') {
    const mark = props.intensite === 'grosse' ? '‡‡' : '‡';
    return (
      <View style={styles.overlay} pointerEvents="auto">
        <Text style={styles.ceremonieTitre}>
          {mark} {props.intensite} branlée de {props.donneur} !
        </Text>
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
        {/* La gloire : le plus gros corps, crème, halo ambré. Pas de glyphe. */}
        <View style={styles.gloire}>
          <Text style={styles.gloireNom} numberOfLines={1}>{props.vainqueur}</Text>
          <Text style={styles.gloireSous}>gagne la partie</Text>
        </View>
        {/* La honte : ☞, plus bas, plus petit, gris. En silence. */}
        <View style={styles.honte}>
          <Text style={styles.honteNom} numberOfLines={1}>☞ {props.dernier}</Text>
          <Text style={styles.honteSous}>le looser</Text>
        </View>
      </View>
      <View style={styles.actions}>
        {props.onCorriger && (
          <TouchableOpacity style={styles.ghost} onPress={props.onCorriger}>
            <Text style={styles.ghostText}>corriger</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.ghost} onPress={props.onConsulter}>
          <Text style={styles.ghostText}>consulter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.plein} onPress={props.onRejouer}>
          <Text style={styles.pleinText}>on rejoue ?</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: matiere.grave.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 16,
  },
  ceremonieTitre: { fontFamily: fonts.affiche, fontSize: 26, letterSpacing: 1, color: palette.cremePage, textAlign: 'center' },

  miroir: { alignItems: 'center', gap: 18 },
  gloire: { alignItems: 'center', gap: 4 },
  // La lumière : le nom en Anton géant, crème, avec un halo ambré (textShadow).
  gloireNom: {
    fontFamily: fonts.affiche,
    fontSize: 46,
    letterSpacing: 1,
    color: palette.cremePage,
    textAlign: 'center',
    textShadowColor: palette.ambre,
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  gloireSous: { ...typography.chrome, fontSize: 12, letterSpacing: 1, color: palette.pierre },

  honte: { alignItems: 'center', gap: 2, opacity: 0.7 },
  honteNom: { fontFamily: fonts.affiche, fontSize: 24, letterSpacing: 1, color: palette.pierre, textAlign: 'center' },
  honteSous: { ...typography.chrome, fontSize: 11, letterSpacing: 2, color: palette.murmure },

  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  ghost: { borderWidth: 1.5, borderColor: palette.cremePage, paddingVertical: 10, paddingHorizontal: 20 },
  ghostText: { ...typography.chrome, color: palette.cremePage, fontSize: 13 },
  plein: { backgroundColor: palette.cremePage, paddingVertical: 12, paddingHorizontal: 24 },
  pleinText: { fontFamily: fonts.affiche, color: palette.encre, fontSize: 16, letterSpacing: 1 },
});
