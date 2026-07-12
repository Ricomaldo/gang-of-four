/* ═══ RESHAPE 0.2 · TAG [†] supprimé ═══
 * Cible : dissous dans le Round (état SAISIR — numpad en zone du bas).
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Saisie de fin de manche — pavé unique + rangée de 4 sélecteurs + Valider.
 * Header = prénom complet du joueur actif. Valider actif seulement à 4/4.
 *
 * Scaffold : saisie libre (append / backspace / re-sélection écrase). La règle
 * d'auto-avance (« 1 » attend un 2e chiffre 0–6 ; 0/2–9 valident et passent au
 * suivant ; max 16 ») reste TODO. Sélection par défaut : le joueur le plus à
 * gauche (SEAT_ORDER[0]), départ prévisible gauche→droite.
 */
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NumPad } from '../components/NumPad';
import { SeatSelectors } from '../components/SeatSelectors';
import { MAX_CARDS, PLAYER_IDS, SEAT_ORDER } from '../domain/model';
import type { CardCount, PlayerId } from '../domain/model';
import { isValidRoundInput } from '../domain/winner';
import { useGameStore } from '../store/gameStore';
import type { RootStackParamList } from '../navigation/types';
import { palette, seatColors } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'ScoreEntry'>;

const initialValues = (): Record<PlayerId, string> => ({ 0: '', 1: '', 2: '', 3: '' });

/** Défaut : toujours le joueur le plus à gauche (SEAT_ORDER[0]). Départ prévisible, gauche→droite. */
function defaultActiveId(): PlayerId {
  return SEAT_ORDER[0];
}

export function ScoreEntryScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const rounds = useGameStore((s) => s.rounds);
  const addRound = useGameStore((s) => s.addRound);

  const [activeId, setActiveId] = useState<PlayerId>(defaultActiveId);
  const [values, setValues] = useState<Record<PlayerId, string>>(initialValues);

  // Saisie bornée à 16 cartes (Sug A, figée). L'auto-avance (1 attend 0–6 ; 0/2–9 valident) reste TODO.
  const onDigit = (d: number) =>
    setValues((v) => {
      const next = (v[activeId] + String(d)).slice(0, 2);
      if (parseInt(next, 10) > MAX_CARDS) return v;
      return { ...v, [activeId]: next };
    });
  const onBackspace = () => setValues((v) => ({ ...v, [activeId]: v[activeId].slice(0, -1) }));

  const filled = PLAYER_IDS.every((id) => values[id].length > 0);
  const cardCounts = {} as Record<PlayerId, CardCount>;
  for (const id of PLAYER_IDS) cardCounts[id] = parseInt(values[id], 10);
  // Garde de saisie (BUG-02) : Valider n'est actif qu'avec exactement un joueur à 0.
  const canValidate = filled && isValidRoundInput(cardCounts);

  const onValidate = () => {
    addRound(cardCounts);
    navigation.goBack();
  };

  // Sélecteurs en ordre tour de table (SEAT_ORDER), cohérent avec les colonnes du carnet.
  const seats = SEAT_ORDER.map((id) => ({
    id,
    color: seatColors[id],
    initial: (players[id].prenom[0] ?? '?').toUpperCase(),
    value: values[id],
  }));

  return (
    <SafeAreaView style={styles.wrap} edges={['top', 'bottom']}>
      <Text style={styles.header}>
        {players[activeId].prenom || 'Joueur'} — cartes restantes ?
      </Text>

      <View style={styles.pad}>
        <NumPad onDigit={onDigit} onBackspace={onBackspace} />
      </View>

      <SeatSelectors seats={seats} activeId={activeId} onSelect={setActiveId} />

      <TouchableOpacity
        style={[styles.validate, !canValidate && styles.validateOff]}
        disabled={!canValidate}
        onPress={onValidate}
      >
        <Text style={styles.validateText}>Valider</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: palette.fondCreme, padding: 20, gap: 18 },
  header: { fontSize: 20, color: palette.encre, textAlign: 'center' },
  pad: { flex: 1, justifyContent: 'center' },
  validate: {
    backgroundColor: palette.encre,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  validateOff: { opacity: 0.3 },
  validateText: { color: palette.fondCreme, fontSize: 18, fontWeight: '600' },
});
