/* ═══ RESHAPE 0.2 · TAG [N] neuf ═══
 * Cible : le moyeu — porte + carrefour des deux mondes (jouer / consulter).
 * Lot : lot 3a — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md §L'accueil · signature/reshape.md §L'IA
 * des écrans · signature/ecrans/01-accueil.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * L'accueil — le moyeu du hub-and-spoke. Object-first : le disque-GANG au
 * centre, tap = jouer (obéit à la règle Gong-en-pause = reprise, fourche Q2) :
 * une partie en cours → reprendre ; sinon → nouvelle partie (Round, état nommer).
 * En dessous : « tes gangs » (GangList), dérivé du vrac.
 *
 * 3 états (manchette, cf. fiche 01-accueil) : vierge (aucun gang connu),
 * invite (gangs connus, « on rejoue ? »), reprise (partie en cours — reprendre
 * + annuler, confirmation légère). L'auto-relance du dernier gang (fiche,
 * état « revanche ») n'est PAS implémentée ici : le brief lot 3a tranche le
 * tap en binaire reprendre/nouvelle-partie — la relance ciblée d'un roster
 * vit à la stèle (« on rejoue ? », lot 3b).
 */
import { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Cartouche } from '../components/Cartouche';
import { GangList } from '../components/GangList';
import { PLAYER_IDS } from '../domain/model';
import { deriveGangs } from '../store/soireeStorage';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Accueil'>;

export function AccueilScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const vrac = useGameStore((s) => s.vrac);
  const masked = useGameStore((s) => s.masked);
  const resetGame = useGameStore((s) => s.resetGame);
  const cancelGame = useGameStore((s) => s.cancelGame);
  const maskGang = useGameStore((s) => s.maskGang);
  const unmaskAllGangs = useGameStore((s) => s.unmaskAllGangs);

  // Une partie « en cours » au sens de l'accueil : au moins un prénom saisi ou
  // une manche jouée — sinon c'est la partie fraîche que le store garde toujours
  // en mémoire (aucune manche, aucun prénom), qui ne mérite pas une « reprise ».
  const hasGameEnCours =
    status === 'en-cours' &&
    (rounds.length > 0 || PLAYER_IDS.some((id) => players[id].prenom.trim().length > 0));

  const allGangs = useMemo(() => deriveGangs(vrac.parties), [vrac]);
  const visibleGangs = useMemo(() => allGangs.filter((g) => !masked.includes(g.key)), [allGangs, masked]);
  const maskedCount = allGangs.length - visibleGangs.length;

  const cartoucheState: 'vierge' | 'invite' | 'reprise' = hasGameEnCours
    ? 'reprise'
    : allGangs.length === 0
      ? 'vierge'
      : 'invite';
  const cartoucheText =
    cartoucheState === 'reprise' ? 'partie en cours' : cartoucheState === 'vierge' ? 'nouveau gang ?' : 'on rejoue ?';

  const onTapDisc = () => {
    // Une partie terminée (déjà archivée au vrac) peut trainer dans le store
    // jusqu'au prochain tour de table — on repart fraîche avant de nommer.
    if (!hasGameEnCours) resetGame(false);
    navigation.navigate('Round');
  };

  const onAnnuler = () => {
    Alert.alert('Annuler la partie ?', 'La partie en cours sera perdue.', [
      { text: 'Reprendre', style: 'cancel' },
      { text: 'Annuler la partie', style: 'destructive', onPress: () => cancelGame() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Cartouche text={cartoucheText} />

      <View style={styles.discZone}>
        <TouchableOpacity onPress={onTapDisc} activeOpacity={0.85} accessibilityLabel={hasGameEnCours ? 'Reprendre la partie' : 'Nouvelle partie'}>
          <View style={styles.disc}>
            <Text style={styles.discText} numberOfLines={2}>
              {'GA\nNG'}
            </Text>
          </View>
        </TouchableOpacity>
        {hasGameEnCours && (
          <TouchableOpacity onPress={onAnnuler} hitSlop={8} style={styles.annulerBtn}>
            <Text style={styles.annulerTxt}>annuler la partie</Text>
          </TouchableOpacity>
        )}
      </View>

      <GangList
        gangs={visibleGangs}
        maskedCount={maskedCount}
        onTapGang={(key) => navigation.navigate('Stele', { gangKey: key })}
        onMasquer={maskGang}
        onRevelerMasques={unmaskAllGangs}
      />
    </SafeAreaView>
  );
}

const DISC_SIZE = 220;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme },
  discZone: { alignItems: 'center', paddingVertical: 24, gap: 14 },
  disc: {
    width: DISC_SIZE,
    height: DISC_SIZE,
    borderRadius: DISC_SIZE / 2,
    backgroundColor: palette.fondPill,
    borderWidth: 4,
    borderColor: palette.encre,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // La grande gueule typographique (disque-GANG 4c) : GANG énorme, sur 2 lignes,
  // coupé aux bords du cercle. Forme d'ossature — le rendu fin vient au lot 4.
  discText: {
    ...typography.proclaim,
    fontSize: 90,
    lineHeight: 82,
    color: palette.encre,
    textAlign: 'center',
  },
  annulerBtn: { paddingVertical: 4, paddingHorizontal: 12 },
  annulerTxt: { ...typography.chrome, fontSize: 12, color: palette.accentSaisie, textDecorationLine: 'underline' },
});
