/* ═══ RESHAPE 0.2 · TAG [R] reshapé ═══
 * Cible : tap = saisie (s'allume) · notif « donne sa meilleure carte » GARDÉE.
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * PAS le long-press renommer (lot 3a) ; le long-press GOF de l'ancien code disparaît (le GOF vivra au Gong, lot 4).
 * ═══════════════════════════════ */
/**
 * PlayerPill — la « zone d'affichage » d'un joueur, à TAILLE FIXE.
 * Calée sur le pire cas (score 3 chiffres + un espace notif réservé) pour que
 * toutes les pills soient identiques quel que soit le score ou la présence de notif.
 *
 * Structure : carte bordée (pastille + prénom + gros score) surmontant un slot notif
 * toujours réservé (vide → hauteur conservée). Présentationnel : tout vient en props.
 */
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { palette, shapes, typography } from '../theme/tokens';

/** Notif qui-donne-à-qui, posée sous la carte dans le footprint fixe de la pill. */
export type PillNotif =
  | { kind: 'winner' }
  | { kind: 'giver'; given: boolean; onGive: () => void }
  | null;

type Props = {
  color: string;
  prenom: string;
  score: number;
  editable?: boolean;
  onChangePrenom?: (v: string) => void;
  /** Tap = seule cible de saisie (le battement) — sélectionne ce joueur pour le numpad. */
  onPress?: () => void;
  /** La pill s'allume : c'est le joueur actif de la saisie en cours. */
  active?: boolean;
  /** Pendant la saisie : les chiffres tapés s'affichent ici, à la place du score total. */
  inputValue?: string;
  notif?: PillNotif;
  /** Côté où le slot notif est réservé. 'above' pour les pills du bas → la carte
   *  hugge le bord bas (symétrie avec les pills du haut) et la notif pointe vers le centre. */
  notifPosition?: 'below' | 'above';
  /** Doublon détecté en saisie : bordure accent pour signaler le conflit. */
  hasError?: boolean;
};

export const PILL_WIDTH = 150;

export function PlayerPill({
  color,
  prenom,
  score,
  editable = false,
  onChangePrenom,
  onPress,
  active = false,
  inputValue,
  notif = null,
  notifPosition = 'below',
  hasError = false,
}: Props) {
  const displayScore = editable ? '' : inputValue !== undefined ? inputValue || '–' : String(score);

  const card = (
    <View style={[styles.card, hasError && styles.cardError, active && styles.cardActive]}>
      <View style={styles.idRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        {editable ? (
          <TextInput
            style={styles.nameInput}
            value={prenom}
            onChangeText={onChangePrenom}
            placeholder="prénom"
            placeholderTextColor={palette.bordureForte}
          />
        ) : (
          <Text style={styles.name} numberOfLines={1}>{prenom}</Text>
        )}
      </View>
      {/* Score toujours présent (espace réservé même en saisie) pour figer la hauteur */}
      <Text style={[styles.score, active && styles.scoreActive]}>{displayScore}</Text>
    </View>
  );

  const cardWrapped =
    !editable && onPress ? (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {card}
      </TouchableOpacity>
    ) : (
      card
    );

  // Slot notif — hauteur toujours réservée pour figer la taille des pills. Placé
  // dessus ou dessous selon notifPosition (la carte hugge toujours le bord extérieur).
  const notifSlot = (
    <View style={[styles.notifSlot, notifPosition === 'above' && styles.notifSlotAbove]}>
      {notif?.kind === 'winner' && (
        <Text style={styles.notifWinner}>⭐️ gagnant manche préc.</Text>
      )}
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
  card: {
    width: PILL_WIDTH,
    height: 96,
    backgroundColor: palette.fondPill,
    borderRadius: shapes.pillRadius,
    borderWidth: shapes.pillBorder,
    borderColor: palette.encre,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  idRow: { flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: PILL_WIDTH - 28 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: palette.bordureForte },
  name: { ...typography.chrome, color: palette.bordureForte, fontSize: 12, flexShrink: 1 },
  nameInput: { color: palette.encre, fontSize: 15, minWidth: 84, paddingVertical: 2, textAlign: 'center' },
  cardError: { borderColor: palette.accentSaisie },
  cardActive: { borderColor: palette.accentSaisie, borderWidth: shapes.pillBorder + 1 },
  score: { ...typography.proclaim, color: palette.score, fontSize: 42, lineHeight: 46 },
  scoreActive: { color: palette.accentSaisie },
  notifSlot: { width: PILL_WIDTH, minHeight: 32, marginTop: 10, alignItems: 'center', justifyContent: 'flex-start' },
  notifSlotAbove: { marginTop: 0, marginBottom: 10, justifyContent: 'flex-end' },
  notifWinner: { fontSize: 11, color: palette.bordureForte, textAlign: 'center' },
  notifGiver: { fontSize: 11, color: palette.encre, textAlign: 'center', textDecorationLine: 'underline' },
});
