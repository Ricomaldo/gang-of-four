/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : LE ROUND : cartouche + plateau + zone du bas à états ; keepAwake ; l'alert « Rejouer avec qui ? » supprimée (retour accueil).
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * L'écran de jeu — la table. Absorbe nommer / jouer / saisir en ÉTATS (pas en
 * écrans) : un seul montage, du 1er prénom au dernier point. Trois conteneurs
 * empilés — cartouche (voix calme) / plateau (~50 %, persistant) / zone du bas
 * (contenu dépendant de l'état, cf. specs-ecrans §Le Round).
 *
 * Le battement (reshape.md §battement) : tap une pill (seule cible) → elle
 * s'allume, le numpad monte → chiffres sur la pill → ordre libre → « = » actif
 * à 4/4 (un seul à 0) → calcul (domain, intouché) → totaux sur les pills.
 *
 * Pas de cérémonie/final ici (lot 2) : à `isGameOver`, l'état « terminé »
 * suffit — un mot + deux portes minimales (resetGame), sans écran d'accueil
 * (lot 3a). Le long-press GOF disparaît (il vivra au Gong, lot 4).
 */
import { useEffect, useState } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Cartouche } from '../components/Cartouche';
import { NumPad } from '../components/NumPad';
import { PlayDirection } from '../components/PlayDirection';
import { PlayerPill } from '../components/PlayerPill';
import type { PillNotif } from '../components/PlayerPill';
import { Quadrant } from '../components/Quadrant';
import { QuadrantGrid } from '../components/QuadrantGrid';
import { MAX_CARDS, PLAYER_IDS, SEAT_ORDER, TABLE_SEATS } from '../domain/model';
import type { CardCount, PlayerId, Round } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeRoundScore, computeTotals } from '../domain/scoring';
import { determineWinner, isValidRoundInput, lowestTotalCandidates, roundLastPlace, roundWinner } from '../domain/winner';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, seatColors, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Round'>;

const KEEP_AWAKE_TAG = 'gang-round';

const blankEntry = (): Record<PlayerId, string> => ({ 0: '', 1: '', 2: '', 3: '' });

const isDuplicate = (players: Record<PlayerId, { prenom: string }>, id: PlayerId) => {
  const v = players[id].prenom.trim().toLowerCase();
  return v.length > 0 && PLAYER_IDS.filter((x) => players[x].prenom.trim().toLowerCase() === v).length > 1;
};

export function RoundScreen(_props: Props) {
  const players = useGameStore((s) => s.players);
  const setPrenom = useGameStore((s) => s.setPrenom);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const addRound = useGameStore((s) => s.addRound);
  const resetGame = useGameStore((s) => s.resetGame);

  const [cardGiven, setCardGiven] = useState(false);
  const [activeId, setActiveId] = useState<PlayerId | null>(null);
  const [entry, setEntry] = useState<Record<PlayerId, string>>(blankEntry);

  const namesReady = PLAYER_IDS.every((id) => players[id].prenom.trim().length > 0) && !PLAYER_IDS.some((id) => isDuplicate(players, id));
  const over = status === 'terminee';

  const state: 'nommer' | 'jouer' | 'saisir' | 'termine' =
    !namesReady ? 'nommer' : over ? 'termine' : activeId !== null ? 'saisir' : 'jouer';

  const totals = computeTotals(rounds);
  const direction = directionOfPlay(rounds.length + 1);
  const winnerId = over ? determineWinner(rounds, TABLE_SEATS) : null;
  const leaderId = rounds.length > 0 && !over ? lowestTotalCandidates(totals)[0] : null;

  const lastRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const prevWinner: PlayerId | null = lastRound ? roundWinner(lastRound) : null;
  const prevLast: PlayerId | null = lastRound ? roundLastPlace(lastRound, totals, TABLE_SEATS) : null;

  // La veille bloquée (friction n°1 soirée 01) : active tant qu'une partie est en cours
  // (nommer → jouer → saisir), relâchée à la fin.
  useEffect(() => {
    // .catch : tant que le module natif n'est pas rebuild (ajouté au lot 1), un
    // échec ici ne doit pas faire planter l'écran — juste ne pas garder l'écran allumé.
    if (status === 'en-cours') {
      activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
    } else {
      deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    }
    return () => { deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {}); };
  }, [status]);

  // Reset de la coche « a donné sa carte » à chaque nouvelle manche.
  useEffect(() => { setCardGiven(false); }, [rounds.length]);

  // Le battement — tap une pill (seule cible) : l'allume, ouvre/rejoint la saisie en cours.
  const selectPlayer = (id: PlayerId) => setActiveId(id);

  const onDigit = (d: number) => {
    if (activeId === null) return;
    setEntry((v) => {
      const next = (v[activeId] + String(d)).slice(0, 2);
      if (parseInt(next, 10) > MAX_CARDS) return v;
      return { ...v, [activeId]: next };
    });
  };
  const onBackspace = () => {
    if (activeId === null) return;
    setEntry((v) => ({ ...v, [activeId]: v[activeId].slice(0, -1) }));
  };

  const filled = PLAYER_IDS.every((id) => entry[id].length > 0);
  const cardCounts = {} as Record<PlayerId, CardCount>;
  for (const id of PLAYER_IDS) cardCounts[id] = parseInt(entry[id], 10);
  const canValidate = filled && isValidRoundInput(cardCounts);

  const onValidate = () => {
    if (!canValidate) return;
    addRound(cardCounts);
    setEntry(blankEntry());
    setActiveId(null);
  };

  const notifFor = (id: PlayerId): PillNotif => {
    if (state !== 'jouer' && state !== 'saisir') return null;
    if (rounds.length === 0) return null;
    if (id === prevWinner) return { kind: 'winner' };
    if (id === prevLast) return { kind: 'giver', given: cardGiven, onGive: () => setCardGiven(true) };
    return null;
  };

  // Haut : carte contre le bord haut, notif dessous (vers le centre). Bas : carte
  // contre le bord bas, notif dessus (vers le centre). Pills symétriques autour de l'arc.
  const cell = (id: PlayerId, row: 'top' | 'bottom') => (
    <Quadrant key={id} align="center">
      <PlayerPill
        color={seatColors[id]}
        prenom={players[id].prenom}
        score={totals[id]}
        editable={state === 'nommer'}
        hasError={state === 'nommer' && isDuplicate(players, id)}
        onChangePrenom={(v) => setPrenom(id, v)}
        onPress={state === 'jouer' || state === 'saisir' ? () => selectPlayer(id) : undefined}
        active={state === 'saisir' && activeId === id}
        inputValue={state === 'saisir' ? entry[id] : undefined}
        notif={notifFor(id)}
        notifPosition={row === 'top' ? 'below' : 'above'}
      />
    </Quadrant>
  );

  const cartoucheText = state === 'nommer' ? '' : leaderId !== null ? `${players[leaderId].prenom} mène` : '';

  return (
    <SafeAreaView style={styles.safe}>
      <Cartouche text={cartoucheText} />

      <View style={styles.plateauZone}>
        <QuadrantGrid cells={[cell(0, 'top'), cell(1, 'top'), cell(2, 'bottom'), cell(3, 'bottom')]} />
        {(state === 'jouer' || state === 'saisir') && (
          <View style={styles.dirLayer} pointerEvents="none">
            <PlayDirection direction={direction} />
          </View>
        )}
      </View>

      <View style={styles.zoneBas}>
        {state === 'jouer' && <FeuilleApercu rounds={rounds} />}
        {state === 'saisir' && (
          <NumPad onDigit={onDigit} onBackspace={onBackspace} onValidate={onValidate} canValidate={canValidate} />
        )}
        {state === 'termine' && winnerId !== null && (
          <View style={styles.endCard}>
            <Text style={styles.endTitle}>⭐️ {players[winnerId].prenom} gagne</Text>
            <View style={styles.endActions}>
              <TouchableOpacity style={styles.newGame} onPress={() => resetGame(true)}>
                <Text style={styles.newGameText}>Rejouer (mêmes joueurs)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.newGameGhost} onPress={() => resetGame(false)}>
                <Text style={styles.newGameGhostText}>Nouveaux joueurs</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

/**
 * L'aperçu feuille (état jouer, repos) — mini running : les 2 dernières manches
 * + une ligne vierge (écho visuel, pas une cible — le tap-saisie ne vit que sur
 * les pills, cf. fourche 3). Cellules = scores de manche (fourche 4), le cumul
 * vit sur les pills. PAS la feuille modale complète (lot 3b).
 */
function FeuilleApercu({ rounds }: { rounds: Round[] }) {
  const lastRounds = rounds.slice(-2);
  return (
    <View style={styles.feuille}>
      <View style={styles.feuilleRow}>
        {SEAT_ORDER.map((id) => (
          <View key={id} style={[styles.feuilleDot, { backgroundColor: seatColors[id] }]} />
        ))}
      </View>
      {lastRounds.map((round, i) => (
        <View key={i} style={styles.feuilleRow}>
          {SEAT_ORDER.map((id) => (
            <Text key={id} style={styles.feuilleCell}>{computeRoundScore(round.cardCounts[id])}</Text>
          ))}
        </View>
      ))}
      <View style={styles.feuilleRow}>
        {SEAT_ORDER.map((id) => (
          <Text key={id} style={styles.feuilleCellVierge}>–</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme },
  // Le plateau unifié à ~50 % (archi cible) — capé pour rester au-dessus du
  // clavier natif pendant NOMMER (~45-48 % depuis le bas, cf. BUG-03).
  plateauZone: { flex: 5, maxHeight: '50%' },
  dirLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  zoneBas: { flex: 4, justifyContent: 'center' },

  feuille: { paddingHorizontal: 24, gap: 10 },
  feuilleRow: { flexDirection: 'row', justifyContent: 'space-around' },
  feuilleDot: { width: 10, height: 10, borderRadius: 5 },
  feuilleCell: { ...typography.chrome, fontSize: 16, color: palette.encre, minWidth: 28, textAlign: 'center' },
  feuilleCellVierge: { ...typography.chrome, fontSize: 16, color: palette.bordure, minWidth: 28, textAlign: 'center' },

  endCard: {
    backgroundColor: palette.fondPill,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: palette.encre,
    marginHorizontal: 24,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
  },
  endTitle: { ...typography.proclaim, fontSize: 22, color: palette.encre },
  endActions: { gap: 10, alignSelf: 'stretch' },
  newGame: { backgroundColor: palette.encre, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center' },
  newGameText: { color: palette.fondCreme, fontSize: 15, fontWeight: '600' },
  newGameGhost: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1.5, borderColor: palette.bordureForte, alignItems: 'center' },
  newGameGhostText: { color: palette.encre, fontSize: 13, fontWeight: '600' },
});
