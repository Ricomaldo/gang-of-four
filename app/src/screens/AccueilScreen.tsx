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
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Cartouche } from '../components/Cartouche';
import { GangList } from '../components/GangList';
import { PLAYER_IDS } from '../domain/model';
import { deriveGangs } from '../store/vracStorage';
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
        {/* Le logo-GANG : PNG rendu par Claude Design (assets/official/gang-logo.png),
            « vérité pixel » — disque ENCRE + GA/NG Anton + double anneau + fond crème,
            tout baké. Le fond crème du PNG (#F2EDE0) = palette.cremePage → raccord
            invisible. Une image, plus de texte-dans-cercle à recentrer. C'est
            l'objet qu'on frappe → jouer. Le logo Gang of Four (le jeu) ne vit PAS ici. */}
        {/* Ombre portée ronde : le PNG a un fond crème OPAQUE (coins = page), donc
            une ombre brute serait carrée. On clippe l'image en cercle (discClip,
            Ø 93 % = pile le bord de l'anneau, mesuré) et on porte l'ombre sur un
            wrapper séparé (discShadow) — deux vues distinctes, sinon iOS rogne
            l'ombre quand overflow:hidden et shadow cohabitent. Décalée bas + un
            filet à droite (wireframe : 0 10px 24px, l'œil d'Eric veut un poil de droite). */}
        <View style={styles.discShadow}>
          <TouchableOpacity
            onPress={onTapDisc}
            activeOpacity={0.85}
            accessibilityLabel={hasGameEnCours ? 'Reprendre la partie' : 'Nouvelle partie'}
            style={styles.discClip}
          >
            <Image source={GANG_LOGO} style={styles.logo} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        {hasGameEnCours ? (
          <TouchableOpacity onPress={onAnnuler} hitSlop={8} style={styles.annulerBtn}>
            <Text style={styles.annulerTxt}>annuler la partie</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.tapHint}>TAP → NOUVEAU GANG</Text>
        )}
      </View>

      {/* Spacer : la section « tes gangs » est ancrée en bas d'écran. */}
      <View style={styles.spacer} />

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

// Le logo (PNG carré 1024², disque + double anneau + fond crème bakés). Taille
// ~82 % de la largeur, capée : le disque visible (78 % du carré) retombe ~= le
// Ø.66 d'avant. Le fond crème invisible fait office de marge/anneau extérieur.
const LOGO = Math.min(Math.round(Dimensions.get('window').width * 0.82), 360);
// Le disque + double anneau occupe ~92 % du carré (mesuré sur le PNG) ; on clippe
// à 93 % pour coller au bord de l'anneau sans le rogner. Le cercle porte l'ombre.
const DISC = Math.round(LOGO * 0.93);
const GANG_LOGO = require('../../assets/official/gang-logo.png');

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.cremePage },
  spacer: { flex: 1 },
  discZone: { alignItems: 'center', paddingVertical: 24, gap: 14 },
  discShadow: {
    borderRadius: DISC / 2,
    backgroundColor: palette.cremePage,
    shadowColor: palette.encre,
    shadowOffset: { width: 3, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 13,
    elevation: 10,
  },
  discClip: { width: DISC, height: DISC, borderRadius: DISC / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  logo: { width: LOGO, height: LOGO },
  tapHint: { ...typography.chrome, fontSize: 12, letterSpacing: 2, color: palette.murmure },
  annulerBtn: { paddingVertical: 4, paddingHorizontal: 12 },
  annulerTxt: { ...typography.chrome, fontSize: 12, color: palette.murmure, textDecorationLine: 'underline' },
});
