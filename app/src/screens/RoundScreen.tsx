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
 * La voix (lot 2, brief 2026-07-13) : rareté = intensité, un seul surdominant
 * à la fois. `Annonce` porte les 2 surdominants gatés — cérémonie (branlée,
 * differe `addRound` jusqu'à « graver ») et final (remplace la fin nue du
 * lot 1). Le discret (pill qui respire) et le flash léger (passe devant) sont
 * l'ossature de l'échelle, non gatés. Le long-press GOF disparaît (il vivra
 * au Gong, lot 4).
 *
 * La nav (lot 3a, brief 2026-07-13) : Round n'est plus l'écran initial, atteint
 * depuis l'accueil (le moyeu) — rien à câbler ici, le retour se fait par le
 * geste natif de la pile. Appui long sur une pill = renommer ce joueur en
 * cours de partie (fourche 11) : bascule la pill en `editable` (TextInput),
 * câblé à `setPrenom`, quitte au blur.
 *
 * La feuille (lot 3b, brief 2026-07-13) : en état `jouer`, l'aperçu-feuille
 * (FeuilleApercu ci-dessous) est tappable → ouvre la feuille complète
 * (modale, sans archiveId = cette partie en cours).
 *
 * L'undo crayon (lot 3c, brief 2026-07-13) : si la dernière manche est du
 * crayon (non-branlée), sa ligne dans l'aperçu-feuille porte une affordance
 * « corriger » distincte du tap qui ouvre la feuille complète (nested
 * TouchableOpacity — RN route le geste au plus imbriqué, pas de conflit).
 * Ré-ouvre la saisie pré-remplie des 4 valeurs de cette manche ; « = »
 * recommite via le battement existant.
 *
 * La frime (lot 4, brief 2026-07-13) : le Gong (interstice central des 4
 * quadrants, overlay de QuadrantGrid) — tap → `GofAnimation` (plein écran) +
 * gofCount++ (`incrementGof`, global, jamais par joueur), plateau entier en
 * recul (`recede` sur les 4 `Quadrant`). Le même geste rugit à l'ENTRÉE en
 * partie (revanche/roster neuf, jamais à la reprise), non compté — décidé par
 * `freshEntry` (store, transitoire) consommé au premier passage en état
 * `jouer`. L'annonce finale répare le trou ouvert par le lot 3c (« corriger »,
 * réutilise `onCorrigerDerniere`, seulement si la manche gagnante n'est pas
 * une branlée gravée) et comble le reliquat du lot 3b (« consulter » → la
 * stèle du gang courant).
 */
import { useEffect, useRef, useState } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { createAudioPlayer } from 'expo-audio';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Annonce } from '../components/Annonce';
import { Cartouche } from '../components/Cartouche';
import { GofAnimation } from '../components/GofAnimation';
import { Gong } from '../components/Gong';
import { NumPad } from '../components/NumPad';
import { PlayDirection } from '../components/PlayDirection';
import { PlayerPill } from '../components/PlayerPill';
import type { PillNotif } from '../components/PlayerPill';
import { Quadrant } from '../components/Quadrant';
import { QuadrantGrid } from '../components/QuadrantGrid';
import { MAX_CARDS, PLAYER_IDS, SEAT_ORDER, TABLE_SEATS } from '../domain/model';
import type { CardCount, PlayerId, Round } from '../domain/model';
import { directionOfPlay } from '../domain/direction';
import { computeTotals, detectBranlee } from '../domain/scoring';
import {
  determineWinner,
  gameLoser,
  isValidRoundInput,
  lowestTotalCandidates,
  roundLastPlace,
  roundWinner,
} from '../domain/winner';
import { useGameStore } from '../store/gameStore';
import { gangKey } from '../store/vracStorage';
import type { RootStackParamList } from '../navigation/types';
import { palette, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Round'>;

const KEEP_AWAKE_TAG = 'gang-round';

/** Son d'ouverture (Jacques) : joué UNE fois au démarrage délibéré d'une partie,
 *  après la saisie des prénoms (tap-Gong qui quitte le setup). Pas à la reprise. */
const OUVERTURE_SOUND = require('../../assets/sounds/ouverture.wav');

/** L'illustration de la boîte du jeu — filigrane décoratif de la zone du bas (jeu). */
const GAME_BOX = require('../../assets/official/game-box.webp');
/** Opacité du filigrane game-box — atténué (watermark). Ajustable à l'œil. */
const FILIGRANE_OPACITY = 0.15;

const blankEntry = (): Record<PlayerId, string> => ({ 0: '', 1: '', 2: '', 3: '' });

const isDuplicate = (players: Record<PlayerId, { prenom: string }>, id: PlayerId) => {
  const v = players[id].prenom.trim().toLowerCase();
  return v.length > 0 && PLAYER_IDS.filter((x) => players[x].prenom.trim().toLowerCase() === v).length > 1;
};

export function RoundScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const setPrenom = useGameStore((s) => s.setPrenom);
  const rounds = useGameStore((s) => s.rounds);
  const status = useGameStore((s) => s.status);
  const addRound = useGameStore((s) => s.addRound);
  const resetGame = useGameStore((s) => s.resetGame);
  const uncommitLastRound = useGameStore((s) => s.uncommitLastRound);
  const incrementGof = useGameStore((s) => s.incrementGof);
  const freshEntry = useGameStore((s) => s.freshEntry);
  const clearFreshEntry = useGameStore((s) => s.clearFreshEntry);

  const [cardGiven, setCardGiven] = useState(false);
  // La frime (lot 4) : déclenchée UNIQUEMENT par le tap-Gong en jeu (le
  // rugissement d'entrée est retiré — cf. le setup 'nommer' & onTapGong).
  const [frimeOn, setFrimeOn] = useState(false);
  // Le lancement DÉLIBÉRÉ : faux tant que le joueur n'a pas tapé le Gong pour
  // démarrer. Sans ça, nommer le 4ᵉ (dès la 1ʳᵉ lettre) lançait la partie seul.
  const [started, setStarted] = useState(false);
  const [activeId, setActiveId] = useState<PlayerId | null>(null);
  const [entry, setEntry] = useState<Record<PlayerId, string>>(blankEntry);
  // Renommer (fourche 11) : appui long sur une pill, en cours de partie (jouer/saisir).
  // `renamePrevRef` : le prénom au moment d'entrer en renommage — si le champ est
  // quitté vide (effacé puis abandonné), on restaure plutôt que de basculer tout
  // le plateau en 'nommer' (namesReady dépend des 4 prénoms non-vides).
  const [renamingId, setRenamingId] = useState<PlayerId | null>(null);
  const renamePrevRef = useRef('');
  // La cérémonie (branlée) : la manche calculée mais différée — rien n'est
  // commité (addRound) tant que ce n'est pas null. corriger l'efface (retour
  // saisie, entry/activeId intacts) ; graver commite puis l'efface.
  const [ceremonie, setCeremonie] = useState<{ cardCounts: Record<PlayerId, CardCount>; verdict: 'petite' | 'grosse' } | null>(null);
  // Le flash léger (« passe devant ») — ossature, non gaté : bref éclat sur le
  // plateau quand le meneur change entre deux manches.
  const [flash, setFlash] = useState(false);
  const prevLeaderRef = useRef<PlayerId | null>(null);
  // Alignement Gong ↔ frime (lot 4b) : centre vertical réel de plateauZone, où
  // vit le Gong — onLayout donne des coords déjà relatives à SafeAreaView, le
  // même repère que GofAnimation (rendue en sibling direct, absoluteFill).
  const [plateauCenterY, setPlateauCenterY] = useState<number | undefined>(undefined);
  // Le son d'ouverture, tenu en ref pour être nettoyé (démontage / relance).
  const ouverturePlayerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);

  const namesReady = PLAYER_IDS.every((id) => players[id].prenom.trim().length > 0) && !PLAYER_IDS.some((id) => isDuplicate(players, id));
  const over = status === 'terminee';
  // Le setup (nommer) NE se quitte QUE par le lancement délibéré (tap-Gong), jamais
  // parce que les 4 champs ont une lettre — sinon la 1ʳᵉ lettre du 4ᵉ prénom fermait
  // le clavier avant qu'on ait fini de taper (bug 18/07). Le Gong central n'apparaît
  // qu'une fois les noms prêts (`namesReady`) et démarre au tap. Une reprise
  // (rounds > 0) ou une partie finie sautent le setup.
  const inSetup = !started && !over && rounds.length === 0;

  const state: 'nommer' | 'jouer' | 'saisir' | 'termine' =
    inSetup ? 'nommer' : over ? 'termine' : activeId !== null ? 'saisir' : 'jouer';

  const totals = computeTotals(rounds);
  const direction = directionOfPlay(rounds.length + 1);
  const winnerId = over ? determineWinner(rounds, TABLE_SEATS) : null;
  const loserId = over ? gameLoser(rounds, TABLE_SEATS) : null;
  const leaderId = rounds.length > 0 && !over ? lowestTotalCandidates(totals)[0] : null;

  const lastRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const prevWinner: PlayerId | null = lastRound ? roundWinner(lastRound) : null;
  const prevLast: PlayerId | null = lastRound ? roundLastPlace(lastRound, totals, TABLE_SEATS) : null;

  // La dernière manche est corrigeable si c'est du crayon (non-branlée) — une
  // branlée gravée refuse déjà côté store (uncommitLastRound). Sert au « corriger »
  // de la zone du bas (jouer) ET à la porte « corriger » de l'annonce finale.
  const lastCorrectable = lastRound !== null && detectBranlee(lastRound) === null;
  const finalCorrectable = over && lastCorrectable;

  // Détection « passe devant » : un seul flash au moment où le meneur bascule,
  // jamais en cascade avec un surdominant (la cérémonie tient déjà l'écran).
  useEffect(() => {
    if (state !== 'jouer') return;
    const prev = prevLeaderRef.current;
    prevLeaderRef.current = leaderId;
    if (prev !== null && leaderId !== null && prev !== leaderId) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 350);
      return () => clearTimeout(t);
    }
  }, [state, leaderId]);

  // Partie fraîche (resetGame → freshEntry) : ré-arme le lancement délibéré.
  // Plus de rugissement d'entrée — l'anim ne joue QUE sur tap-Gong en jeu
  // (consigne 18/07, supersede specs-anim-frime §rugissement).
  useEffect(() => {
    if (freshEntry) setStarted(false);
  }, [freshEntry]);

  // Tap-Gong : en setup (nommer, noms prêts) il LANCE la partie (aucune anim) ;
  // en jeu il déclenche la frime comptée (gofCount++, global — jamais par joueur),
  // verrouillée pendant qu'une frime joue déjà.
  const onTapGong = () => {
    // En setup, le Gong n'est monté que si les noms sont prêts → il LANCE (aucune anim).
    if (state === 'nommer') {
      if (namesReady) {
        clearFreshEntry();
        setStarted(true);
        // Son d'ouverture : au lancement délibéré, après la saisie des prénoms.
        ouverturePlayerRef.current?.remove();
        const player = createAudioPlayer(OUVERTURE_SOUND);
        ouverturePlayerRef.current = player;
        player.play();
      }
      return;
    }
    if (frimeOn) return;
    incrementGof();
    setFrimeOn(true);
  };

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

  // Libère le player d'ouverture au démontage de l'écran.
  useEffect(() => () => { ouverturePlayerRef.current?.remove(); }, []);

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

  // « = » : le calcul (domain, intouché) tranche. Une branlée est la SEULE
  // manche qui passe par la cérémonie — differe addRound jusqu'à « graver ».
  const onValidate = () => {
    if (!canValidate) return;
    const verdict = detectBranlee({ cardCounts });
    if (verdict !== null) {
      setCeremonie({ cardCounts, verdict });
      return;
    }
    addRound(cardCounts);
    setEntry(blankEntry());
    setActiveId(null);
  };

  // corriger : retour à la saisie, rien n'est commité (le crayon — on garde
  // les chiffres tapés pour éditer).
  const onCorrigerCeremonie = () => setCeremonie(null);

  // graver : commit (addRound), scellé, irréversible (le gravé).
  const onGraverCeremonie = () => {
    if (!ceremonie) return;
    addRound(ceremonie.cardCounts);
    setCeremonie(null);
    setEntry(blankEntry());
    setActiveId(null);
  };

  // corriger la dernière manche (le crayon, lot 3c) : retire la manche du
  // store, ré-ouvre la saisie pré-remplie de ses 4 valeurs — l'utilisateur
  // édite ce qu'il veut puis « = » recommite.
  const onCorrigerDerniere = () => {
    const counts = uncommitLastRound();
    if (!counts) return;
    const nextEntry = {} as Record<PlayerId, string>;
    for (const id of PLAYER_IDS) nextEntry[id] = String(counts[id]);
    setEntry(nextEntry);
    setActiveId(SEAT_ORDER[0]);
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
  const cell = (id: PlayerId, row: 'top' | 'bottom') => {
    const isRenaming = renamingId === id;
    const isLeader = id === leaderId;
    return (
      <Quadrant key={id} align="center" leader={isLeader} recede={frimeOn}>
        <PlayerPill
          leader={isLeader}
          prenom={players[id].prenom}
          score={totals[id]}
          editable={state === 'nommer' || isRenaming}
          hasError={state === 'nommer' && isDuplicate(players, id)}
          onChangePrenom={(v) => setPrenom(id, v)}
          onPress={!isRenaming && (state === 'jouer' || state === 'saisir') ? () => selectPlayer(id) : undefined}
          onLongPress={
            state === 'jouer' || state === 'saisir'
              ? () => { renamePrevRef.current = players[id].prenom; setRenamingId(id); }
              : undefined
          }
          onBlur={
            isRenaming
              ? () => {
                  if (players[id].prenom.trim().length === 0) setPrenom(id, renamePrevRef.current);
                  setRenamingId(null);
                }
              : undefined
          }
          active={(state === 'saisir' && activeId === id) || isRenaming}
          inputValue={state === 'saisir' ? entry[id] : undefined}
          notif={notifFor(id)}
          notifPosition={row === 'top' ? 'below' : 'above'}
          pulse={id === prevWinner}
          pulseKey={rounds.length}
        />
      </Quadrant>
    );
  };

  // Le meneur au cartouche : son prénom en AMBRE (le seul chaud toléré ici), « mène » en crème.
  const leaderName = state !== 'nommer' && leaderId !== null ? players[leaderId].prenom : null;
  // En saisie (nommer) le cartouche invite déjà — « Qui joue ? » — puis bascule
  // sur « on joue ? » quand les 4 prénoms sont prêts (le Gong apparaît).
  const cartoucheText = leaderName ? 'mène' : state === 'nommer' ? (namesReady ? 'on joue ?' : 'Qui joue ?') : '';

  return (
    <SafeAreaView style={styles.safe}>
      <Cartouche accent={leaderName ?? undefined} text={cartoucheText} />

      <View
        style={styles.plateauZone}
        onLayout={(e) => {
          const { y, height } = e.nativeEvent.layout;
          setPlateauCenterY(y + height / 2);
        }}
      >
        <QuadrantGrid
          cells={[cell(0, 'top'), cell(1, 'top'), cell(2, 'bottom'), cell(3, 'bottom')]}
          overlay={
            (state === 'nommer' && namesReady) || state === 'jouer' || state === 'saisir'
              ? <Gong onPress={onTapGong} disabled={frimeOn || ceremonie !== null} />
              : undefined
          }
        />
        {(state === 'jouer' || state === 'saisir') && (
          <View style={styles.dirLayer} pointerEvents="none">
            <PlayDirection direction={direction} />
          </View>
        )}
        {flash && <View style={styles.flashLayer} pointerEvents="none" />}
        {ceremonie && (
          <Annonce
            kind="ceremonie"
            intensite={ceremonie.verdict}
            donneur={players[roundWinner({ cardCounts: ceremonie.cardCounts })].prenom}
            onCorriger={onCorrigerCeremonie}
            onGraver={onGraverCeremonie}
          />
        )}
        {state === 'termine' && winnerId !== null && loserId !== null && (
          <Annonce
            kind="final"
            vainqueur={players[winnerId].prenom}
            dernier={players[loserId].prenom}
            onRejouer={() => resetGame(true)}
            onCorriger={finalCorrectable ? onCorrigerDerniere : undefined}
            onConsulter={() => navigation.navigate('Stele', { gangKey: gangKey(players) })}
          />
        )}
      </View>

      <View style={styles.zoneBas}>
        {state === 'nommer' && (
          // Saisie des prénoms : retour explicite au moyeu, comme la Stèle. Rien
          // n'est commité tant que le Gong n'a pas lancé — quitter est sans risque.
          <View style={styles.retourWrap}>
            <TouchableOpacity onPress={() => navigation.navigate('Accueil')} hitSlop={8} style={styles.retourBtn}>
              <Text style={styles.retour}>← accueil</Text>
            </TouchableOpacity>
          </View>
        )}
        {state === 'jouer' && (
          // Zone du bas (jeu) : la boîte du jeu en filigrane (décor, non tappable),
          // le bouton net « LA FEUILLE » porte l'action, « corriger » dessous si la
          // dernière manche est du crayon. Les totaux vivent sur les pills — plus
          // d'aperçu chiffré ici (redondant, jugé obscur — Eric 31/07).
          <View style={styles.playBottom}>
            <Image source={GAME_BOX} style={styles.filigrane} resizeMode="contain" />
            <TouchableOpacity
              style={styles.feuilleBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Feuille')}
              accessibilityLabel="Voir la feuille complète"
            >
              <Text style={styles.feuilleBtnTxt}>la feuille de scores</Text>
            </TouchableOpacity>
            {lastCorrectable && (
              <TouchableOpacity onPress={onCorrigerDerniere} hitSlop={8} style={styles.corrigerBtn} accessibilityLabel="Corriger la dernière manche">
                <Text style={styles.corrigerTxt}>corriger la dernière manche</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {state === 'saisir' && !ceremonie && (
          <NumPad onDigit={onDigit} onBackspace={onBackspace} onValidate={onValidate} canValidate={canValidate} />
        )}
      </View>

      {/* La frime — plein écran, par-dessus tout le safe-area (pas seulement
          plateauZone, cf. specs-anim-frime.md). Tap-Gong ou rugissement d'entrée,
          même rendu. */}
      {frimeOn && <GofAnimation onDone={() => setFrimeOn(false)} originY={plateauCenterY} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.cremePage },
  // Le plateau unifié à ~50 % (archi cible) — capé pour rester au-dessus du
  // clavier natif pendant NOMMER (~45-48 % depuis le bas, cf. BUG-03).
  plateauZone: { flex: 5, maxHeight: '50%' },
  dirLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  // Le flash léger (« passe devant », ossature) — un bref éclat ambré (la lumière).
  flashLayer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: palette.ambre, opacity: 0.18 },
  zoneBas: { flex: 4, justifyContent: 'center' },
  retourWrap: { flex: 1, justifyContent: 'flex-end' },
  retourBtn: { alignItems: 'center', paddingVertical: 12 },
  retour: { ...typography.chrome, fontSize: 13, color: palette.murmure, textDecorationLine: 'underline' },

  // Zone du bas (jeu) : la boîte en filigrane + le bouton feuille par-dessus.
  playBottom: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  // Le filigrane game-box : plein cadre, atténué, derrière le bouton (non tappable).
  filigrane: { position: 'absolute', width: '100%', height: '100%', opacity: FILIGRANE_OPACITY },
  // Le bouton net (placard : bande encre, mono crème espacé) — porte l'action.
  feuilleBtn: { backgroundColor: palette.encre, paddingVertical: 14, paddingHorizontal: 36 },
  feuilleBtnTxt: { ...typography.chrome, fontSize: 13, letterSpacing: 3, color: palette.cremePage },
  corrigerBtn: { paddingVertical: 2 },
  corrigerTxt: { ...typography.chrome, fontSize: 11, color: palette.orange, textDecorationLine: 'underline' },
});
