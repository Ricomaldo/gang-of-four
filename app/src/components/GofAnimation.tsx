/**
 * GofAnimation — la frime « GANG OF FOUR ! », overlay plein écran, 5 s fixe.
 * Source de vérité : app/docs/specs/specs-anim-frime.md.
 *
 * Frime totale, aucune retenue. Tous les beats démarrent à la 1ʳᵉ frame :
 *  - scale overshoot (part du disque central, dépasse le plein écran, claque en place)
 *  - jitter de rotation ±3° (vibre d'énergie), respiration (pulse de scale)
 *  - fond disco plein spectre à cuts durs, biaisé vers la couleur du joueur
 *  - sunburst (rayons de gloire) tournant lentement derrière l'image
 *  - freeze triomphal ~0,5 s sur la dernière frame
 * Le board qui recule (3 autres quadrants) est géré côté RoundScreen/Quadrant.
 * Le son (un des 3, aléatoire) se lance au montage, sans synchro.
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { createAudioPlayer } from 'expo-audio';
import type { PlayerId } from '../domain/model';
import { seatColors, shapes } from '../theme/tokens';
import { nextGofSoundIndex } from './gofSound';

const DURATION = 5000; // durée totale fixe
const FREEZE = 500; // freeze triomphal sur la dernière frame
const CUT_MS = 140; // cadence des cuts disco (durs)
const RAMP_MS = 300; // le fond disco n'est pas couvrant à l'ouverture (board qui recule visible)

/** Spectre saturé, criard assumé. La couleur du joueur y est surpondérée à l'usage. */
const SPECTRUM = ['#FF0033', '#00E5FF', '#FF00E5', '#00FF66', '#FFEA00', '#FF6A00', '#7A00FF'];

const SOUNDS = [
  require('../../assets/sounds/gof-01.mp3'),
  require('../../assets/sounds/gof-02.mp3'),
  require('../../assets/sounds/gof-03.mp3'),
];

const GOF_IMAGE = require('../../assets/official/gang-of-four.webp');

type Props = {
  playerId: PlayerId;
  onDone: () => void;
};

/** Alterne couleur joueur / spectre → la couleur du gagnant revient ~1 cut sur 2. */
function biasedCuts(playerColor: string): string[] {
  const cuts: string[] = [];
  for (let i = 0; i < SPECTRUM.length; i++) {
    cuts.push(playerColor, SPECTRUM[i]);
  }
  return cuts;
}

export function GofAnimation({ playerId, onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const playerColor = seatColors[playerId];
  const cuts = useRef(biasedCuts(playerColor)).current;

  const [cutIndex, setCutIndex] = useState(0);
  const [frozen, setFrozen] = useState(false);

  // Toutes en native driver (transform/opacity) sauf le fond (couleur = setState).
  const scale = useRef(new Animated.Value(shapes.discSize / width)).current; // part du disque central
  const jitter = useRef(new Animated.Value(0)).current; // ±1 → ±3°
  const breath = useRef(new Animated.Value(0)).current; // respiration
  const sunburst = useRef(new Animated.Value(0)).current; // rotation lente
  const bgOpacity = useRef(new Animated.Value(0)).current; // ramp d'ouverture (non-couvrant)

  useEffect(() => {
    // Son aléatoire (jamais deux fois le même d'affilée), lancé et oublié.
    const player = createAudioPlayer(SOUNDS[nextGofSoundIndex(SOUNDS.length)]);
    player.play();

    // Le fond disco monte en opacité sur RAMP_MS → le board recule à découvert d'abord.
    Animated.timing(bgOpacity, { toValue: 1, duration: RAMP_MS, useNativeDriver: true }).start();

    // Scale overshoot : disque → dépasse le plein écran → claque en place (spring dur).
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.15, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 140, useNativeDriver: true }),
    ]).start();

    // Jitter de rotation — loop rapide, dès la 1ʳᵉ frame.
    const jitterLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(jitter, { toValue: 1, duration: 55, useNativeDriver: true }),
        Animated.timing(jitter, { toValue: -1, duration: 55, useNativeDriver: true }),
      ]),
    );
    jitterLoop.start();

    // Respiration — pulse de scale par-dessus le shake.
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 240, useNativeDriver: true }),
        Animated.timing(breath, { toValue: 0, duration: 240, useNativeDriver: true }),
      ]),
    );
    breathLoop.start();

    // Sunburst — rotation lente continue.
    const sunburstLoop = Animated.loop(
      Animated.timing(sunburst, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true }),
    );
    sunburstLoop.start();

    // Cuts disco durs.
    const cutTimer = setInterval(() => setCutIndex((i) => (i + 1) % cuts.length), CUT_MS);

    // Freeze triomphal : on coupe tout et on fige la dernière frame.
    const freezeTimer = setTimeout(() => {
      jitterLoop.stop();
      breathLoop.stop();
      clearInterval(cutTimer);
      jitter.setValue(0);
      breath.setValue(0);
      setFrozen(true);
    }, DURATION - FREEZE);

    const doneTimer = setTimeout(onDone, DURATION);

    return () => {
      jitterLoop.stop();
      breathLoop.stop();
      sunburstLoop.stop();
      clearInterval(cutTimer);
      clearTimeout(freezeTimer);
      clearTimeout(doneTimer);
      player.remove();
    };
    // Monté une seule fois par déclenchement (clé du remount côté parent).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotate = jitter.interpolate({ inputRange: [-1, 1], outputRange: ['-3deg', '3deg'] });
  const breathScale = breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const spin = sunburst.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  // Sunburst : rayons rayonnants, plus grand que l'écran pour couvrir les coins en rotation.
  const rayR = Math.max(width, height);
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a0 = (i / 24) * Math.PI * 2;
    const a1 = a0 + (Math.PI * 2) / 48; // demi-secteur → alternance plein/vide
    return (
      <Polygon
        key={i}
        points={`0,0 ${Math.cos(a0) * rayR},${Math.sin(a0) * rayR} ${Math.cos(a1) * rayR},${Math.sin(a1) * rayR}`}
        fill="rgba(255,255,255,0.18)"
      />
    );
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Fond disco — cut dur via backgroundColor (setState), opacité en ramp d'ouverture. */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: cuts[cutIndex], opacity: bgOpacity }]} />

      {/* Rayons de gloire, derrière l'image. */}
      <Animated.View style={[styles.center, { transform: [{ rotate: spin }] }]}>
        <Svg width={rayR * 2} height={rayR * 2} viewBox={`${-rayR} ${-rayR} ${rayR * 2} ${rayR * 2}`}>
          {rays}
        </Svg>
      </Animated.View>

      {/* L'image transparente flashe sur le disco. */}
      <View style={styles.center}>
        <Animated.Image
          source={GOF_IMAGE}
          resizeMode="contain"
          style={{
            width,
            height,
            transform: [{ scale: Animated.multiply(scale, frozen ? 1 : breathScale) }, { rotate }],
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
