/**
 * PlayerPill — la « zone d'affichage » d'un joueur, à TAILLE FIXE.
 * Calée sur le pire cas (score 3 chiffres + un espace notif réservé) pour que
 * toutes les pills soient identiques quel que soit le score ou la présence de notif.
 *
 * Structure : carte bordée (pastille + prénom + gros score) surmontant un slot notif
 * toujours réservé (vide → hauteur conservée). Présentationnel : tout vient en props.
 */
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { palette, shapes } from '../theme/tokens';

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
  onLongPress?: () => void;
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
  onLongPress,
  notif = null,
  notifPosition = 'below',
  hasError = false,
}: Props) {
  const card = (
    <View style={[styles.card, hasError && styles.cardError]}>
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
      <Text style={styles.score}>{editable ? '' : score}</Text>
    </View>
  );

  const cardWrapped =
    !editable && onLongPress ? (
      <TouchableOpacity onLongPress={onLongPress} delayLongPress={600} activeOpacity={0.8}>
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
  name: { color: palette.bordureForte, fontSize: 12, fontWeight: '700', flexShrink: 1 },
  nameInput: { color: palette.encre, fontSize: 15, minWidth: 84, paddingVertical: 2, textAlign: 'center' },
  cardError: { borderColor: palette.accentSaisie },
  score: { color: palette.score, fontSize: 42, fontWeight: '700', lineHeight: 46 },
  notifSlot: { width: PILL_WIDTH, minHeight: 32, marginTop: 10, alignItems: 'center', justifyContent: 'flex-start' },
  notifSlotAbove: { marginTop: 0, marginBottom: 10, justifyContent: 'flex-end' },
  notifWinner: { fontSize: 11, color: palette.bordureForte, textAlign: 'center' },
  notifGiver: { fontSize: 11, color: palette.encre, textAlign: 'center', textDecorationLine: 'underline' },
});
