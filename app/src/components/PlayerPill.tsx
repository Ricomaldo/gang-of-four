/* ═══ RESHAPE 0.2 · TAG [R] reshapé — LE PLACARD ═══
 * Cible : la cellule joueur du plateau — prénom mono + total Anton, PAS de
 * pastille (le placard retire les 4 couleurs de siège). Le meneur = crème + ◀
 * (la cellule s'allume rouge côté Quadrant). tap = saisie · appui long = renommer.
 * Specs : GANG - Specs placard §Round · specs-ecrans.md §battement (fait foi).
 * ═══════════════════════════════ */
/**
 * PlayerPill — le CONTENU d'une cellule du plateau (le cadre/fond vit sur le
 * Quadrant). À footprint fixe pour que les 4 cellules soient identiques quel que
 * soit le score ou la notif. Présentationnel : tout vient en props.
 *
 * Placard : prénom (mono, petit) surmontant le total (Anton, gros). Plus de
 * pastille couleur. Le meneur porte le ◀ et passe en crème (sa cellule est
 * remplie rouge par le Quadrant). Le fréquent (pulse, notif) reste discret.
 *
 * États préservés : `editable` (nommer/renommer, TextInput) · `active` (saisie,
 * la pill s'allume) · `inputValue` (les chiffres tapés sur la pill) · `notif`
 * (gagnant ▲ / donneur) · `pulse` (le gagnant de manche respire).
 */
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fonts, palette, typography } from '../theme/tokens';

/** Notif qui-donne-à-qui, posée sous la carte dans le footprint fixe de la pill. */
export type PillNotif =
  | { kind: 'winner' }
  | { kind: 'giver'; given: boolean; onGive: () => void }
  | null;

type Props = {
  prenom: string;
  score: number;
  /** Le meneur (cumul le plus bas) : texte crème + ◀. Sa cellule est rouge (Quadrant). */
  leader?: boolean;
  editable?: boolean;
  onChangePrenom?: (v: string) => void;
  /** Tap = seule cible de saisie (le battement) — sélectionne ce joueur pour le numpad. */
  onPress?: () => void;
  /** Appui long = renommer (identité), libre depuis que le GOF vit au Gong. */
  onLongPress?: () => void;
  /** Quitte le renommage (perte du focus du TextInput) — pas d'autre confirmation. */
  onBlur?: () => void;
  /** La pill s'allume : c'est le joueur actif de la saisie en cours. */
  active?: boolean;
  /** Pendant la saisie : les chiffres tapés s'affichent ici, à la place du score total. */
  inputValue?: string;
  notif?: PillNotif;
  /** Côté où le slot notif est réservé. 'above' pour les pills du bas → la carte
   *  hugge le bord bas (symétrie avec les pills du haut) et la notif pointe vers le centre. */
  notifPosition?: 'below' | 'above';
  /** Doublon détecté en saisie : le prénom vire au rouge pour signaler le conflit. */
  hasError?: boolean;
  /** Le discret de l'échelle (lot 2) : la pill du gagnant de manche respire. Ossature — pas gaté. */
  pulse?: boolean;
  /** Ne relance le pulse qu'au changement de manche (sinon `pulse` reste vrai sans re-déclencher). */
  pulseKey?: number;
};

export const PILL_WIDTH = 150;

export function PlayerPill({
  prenom,
  score,
  leader = false,
  editable = false,
  onChangePrenom,
  onPress,
  onLongPress,
  onBlur,
  active = false,
  inputValue,
  notif = null,
  notifPosition = 'below',
  hasError = false,
  pulse = false,
  pulseKey,
}: Props) {
  const displayScore = editable ? '' : inputValue !== undefined ? inputValue || '–' : String(score);
  const inverse = leader; // texte clair (la cellule est rouge)

  // Le discret (échelle, lot 2) : un pulse ponctuel, une fois par manche.
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!pulse) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.05, duration: 160, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulse, pulseKey]);

  const content = (
    <Animated.View style={[styles.content, active && styles.contentActive, { transform: [{ scale }] }]}>
      {editable ? (
        <TextInput
          style={[styles.nameInput, hasError && styles.nameInputError]}
          value={prenom}
          onChangeText={onChangePrenom}
          onBlur={onBlur}
          autoFocus={active}
          placeholder="prénom"
          placeholderTextColor={palette.estompe}
        />
      ) : (
        <Text style={[styles.name, inverse && styles.nameInverse]} numberOfLines={1}>
          {leader ? '◀ ' : ''}
          {prenom}
        </Text>
      )}
      {/* Total toujours présent (espace réservé même en saisie) pour figer la hauteur */}
      <Text style={[styles.score, inverse && styles.scoreInverse, active && styles.scoreActive]}>{displayScore}</Text>
    </Animated.View>
  );

  const cardWrapped =
    !editable && (onPress || onLongPress) ? (
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    ) : (
      content
    );

  // Slot notif — hauteur toujours réservée pour figer la taille des pills. Placé
  // dessus ou dessous selon notifPosition (la carte hugge toujours le bord extérieur).
  const notifSlot = (
    <View style={[styles.notifSlot, notifPosition === 'above' && styles.notifSlotAbove]}>
      {notif?.kind === 'winner' && <Text style={styles.notifWinner}>▲ gagnant manche préc.</Text>}
      {notif?.kind === 'giver' && (
        <TouchableOpacity onPress={notif.onGive} disabled={notif.given} hitSlop={6}>
          <Text style={styles.notifGiver}>
            {notif.given ? 'a donné sa meilleure carte' : 'donne sa meilleure carte'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.zone}>
      {notifPosition === 'above' && notifSlot}
      {cardWrapped}
      {notifPosition === 'below' && notifSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  zone: { width: PILL_WIDTH, alignItems: 'center' },
  // Le contenu de la cellule : prénom + total, sans carte (le Quadrant porte le
  // cadre/fond). Hauteur fixe pour que les 4 pills soient identiques.
  content: {
    width: PILL_WIDTH,
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  // La pill s'allume en saisie : liseré orangé (le vivant).
  contentActive: { borderWidth: 2, borderColor: palette.orange, borderRadius: 8 },
  name: { ...typography.chrome, fontSize: 13, letterSpacing: 1, color: palette.murmure },
  nameInverse: { color: palette.cremePage },
  nameInput: { fontFamily: fonts.mono, color: palette.encre, fontSize: 15, minWidth: 90, paddingVertical: 2, textAlign: 'center' },
  nameInputError: { color: palette.rouge },
  // Le total en Anton, gros (l'affiche). Le meneur en crème, la saisie en orangé.
  // lineHeight nettement > fontSize (31/07 : 58/54 rognait encore les capitales
  // d'Anton sur device réel — corrigé en réel, pas en théorie).
  score: { fontFamily: fonts.affiche, color: palette.encre, fontSize: 54, lineHeight: 65, letterSpacing: 1 },
  scoreInverse: { color: palette.cremePage },
  scoreActive: { color: palette.orange },
  notifSlot: { width: PILL_WIDTH, minHeight: 30, marginTop: 8, alignItems: 'center', justifyContent: 'flex-start' },
  notifSlotAbove: { marginTop: 0, marginBottom: 8, justifyContent: 'flex-end' },
  notifWinner: { ...typography.chrome, fontSize: 11, color: palette.murmure, textAlign: 'center' },
  notifGiver: { ...typography.chrome, fontSize: 11, color: palette.encre, textAlign: 'center', textDecorationLine: 'underline' },
});
