/* ═══ RESHAPE 0.2 · TAG [R] reshapé — STOPGAP LOT 1 (temporaire, borné) ═══
 * Cible finale : stack hub-and-spoke (accueil · Round · stèle + feuille modale) — lot 3a.
 * Ici : Splash → Round directement, le Round gère nommer/reprise lui-même. Pas de
 * hub-and-spoke ni d'accueil (lot 3a). SetupScreen/ScoreEntryScreen/ScoreGridScreen
 * restent sur le disque, non routés (ils meurent en 3a) — RootStackParamList les
 * garde déclarés pour que ces fichiers restent tsc-clean.
 * Lot : lot 1 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Racine de l'app — container de navigation + stack unique.
 * Splash → Round (nouveau Round : nommer/jouer/saisir en états, un seul écran).
 */
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RoundScreen } from './src/screens/RoundScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { useGameStore } from './src/store/gameStore';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const hydrate = useGameStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Round" component={RoundScreen} options={{ animation: 'fade' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
