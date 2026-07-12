/* ═══ RESHAPE 0.2 · TAG [†] supprimé ═══
 * Cible : dissous dans le Round (état NOMMER — clavier en zone du bas).
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * SetupScreen — saisie des 4 prénoms avant la partie.
 *
 * Réutilise l'ossature de l'écran de manche (QuadrantGrid + Quadrant + PlayerPill
 * éditable + Hub). La forme est posée d'emblée en version COMPACTE : la grille 2×2
 * occupe le haut, une zone stats occupe le bas — pas de « shrink » animé au premier
 * tap. Le clavier vient recouvrir la zone stats (inutile pendant la saisie) sans
 * masquer les cadrans, qui restent au-dessus.
 *
 * La zone basse est le futur emplacement des stats all-time (palier 2) — placeholder
 * en attendant. Le Hub porte l'invite « QUI JOUE ? » tant que les 4 prénoms ne sont
 * pas saisis, puis passe à « READY » (actif) : SEUL le tap READY lance la partie.
 */
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Hub } from '../components/Hub';
import { Palmares } from '../components/Palmares';
import { PlayerPill } from '../components/PlayerPill';
import { Quadrant } from '../components/Quadrant';
import { QuadrantGrid } from '../components/QuadrantGrid';
import { PLAYER_IDS } from '../domain/model';
import type { GameArchive, PlayerId } from '../domain/model';
import { useGameStore } from '../store/gameStore';
import { soireeDate } from '../store/soireeStorage';
import type { RootStackParamList } from '../navigation/types';
import { palette, seatColors } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Setup'>;

export function SetupScreen({ navigation }: Props) {
  const players = useGameStore((s) => s.players);
  const setPrenom = useGameStore((s) => s.setPrenom);
  const soiree = useGameStore((s) => s.soiree);

  const today = soireeDate(Date.now());
  const archivedParties: GameArchive[] = soiree && soiree.date === today ? soiree.parties : [];

  const isDuplicate = (id: PlayerId) => {
    const v = players[id].prenom.trim().toLowerCase();
    return v.length > 0 &&
      PLAYER_IDS.filter((x) => players[x].prenom.trim().toLowerCase() === v).length > 1;
  };

  const namesReady =
    PLAYER_IDS.every((id) => players[id].prenom.trim().length > 0) &&
    !PLAYER_IDS.some(isDuplicate);

  // Cadrans du haut : pills vers le haut ; du bas : pills vers le bas. Les 4 pills
  // s'écartent vers les bords et laissent le hub central respirer (compact = shrinked).
  const cell = (id: PlayerId, align: 'top' | 'bottom') => (
    <Quadrant key={id} align={align}>
      <PlayerPill
        color={seatColors[id]}
        prenom={players[id].prenom}
        score={0}
        editable
        hasError={isDuplicate(id)}
        onChangePrenom={(v) => setPrenom(id, v)}
        notifPosition={align === 'top' ? 'below' : 'above'}
      />
    </Quadrant>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Grille compacte en haut — reste au-dessus du clavier */}
      <View style={styles.gridZone}>
        <QuadrantGrid
          cells={[cell(0, 'top'), cell(1, 'top'), cell(2, 'bottom'), cell(3, 'bottom')]}
          overlay={
            <Hub
              state={namesReady ? 'ready' : 'invite'}
              disabled={!namesReady}
              onPress={() => navigation.replace('Round')}
            />
          }
        />
      </View>

      {/* Zone basse — palmarès collectif de la soirée (recouverte par le clavier en saisie) */}
      <ScrollView style={styles.statsZone} contentContainerStyle={styles.statsContent}>
        <Palmares parties={archivedParties} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.fondCreme },
  // Ratio grille / stats : la grille est capée à 52 % (maxHeight) pour que son bas reste
  // au-dessus du clavier (~45-48 % depuis le bas). La zone stats est recouverte pendant la saisie.
  gridZone: { flex: 5, maxHeight: '52%' },
  statsZone: { flex: 4 },
  statsContent: { paddingHorizontal: 20, paddingBottom: 20 },
});
