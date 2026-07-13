/* ═══ RESHAPE 0.2 · TAG [N] neuf — STUB LOT 3a (route déclarée, écran réel = lot 3b) ═══
 * Cible : la grille manche × joueur, deux matières crayon/gravé, partager (lot 3b).
 * Lot : lot 3a — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md §La stèle & la feuille (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * La feuille — stub, présentée en modale (glissé). Rien ne l'ouvre encore en
 * lot 3a (aucun appelant câblé) ; la route est déclarée pour que Round/Stele
 * puissent y naviguer dès le lot 3b sans retoucher la nav.
 */
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { palette, typography } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Feuille'>;

export function FeuilleScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.txt}>bientôt</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
        <Text style={styles.retour}>fermer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme, alignItems: 'center', justifyContent: 'center', gap: 16 },
  txt: { ...typography.proclaim, fontSize: 28, color: palette.encre },
  retour: { ...typography.chrome, fontSize: 13, color: palette.bordureForte, textDecorationLine: 'underline' },
});
