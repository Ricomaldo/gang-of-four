/* ═══ RESHAPE 0.2 · TAG [R] reshapé — hub-and-spoke (lot 3a) ═══
 * Cible : stack hub-and-spoke (accueil · Round · stèle + feuille modale).
 * Remplace le stopgap lot 1 (Splash → Round direct). Splash retiré (point
 * remonté à Eric, brief lot 3a : l'app ouvre sur l'accueil par défaut).
 * Lot : lot 3a — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Racine de l'app — container de navigation + stack unique.
 * Accueil (le moyeu) → Round (jeu) · Stele / Feuille (stubs, lot 3b). Tout
 * passe par l'accueil ; le retour au moyeu se fait par le geste natif de la
 * pile (swipe-back / bouton retour), toujours à un geste (anti-enfermement).
 */
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AccueilScreen } from './src/screens/AccueilScreen';
import { RoundScreen } from './src/screens/RoundScreen';
import { SteleScreen } from './src/screens/SteleScreen';
import { FeuilleScreen } from './src/screens/FeuilleScreen';
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
        <Stack.Navigator initialRouteName="Accueil" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Accueil" component={AccueilScreen} />
          <Stack.Screen name="Round" component={RoundScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Stele" component={SteleScreen} />
          <Stack.Screen name="Feuille" component={FeuilleScreen} options={{ presentation: 'modal' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
