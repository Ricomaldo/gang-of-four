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
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';
import { Caveat_700Bold } from '@expo-google-fonts/caveat';
import { AccueilScreen } from './src/screens/AccueilScreen';
import { RoundScreen } from './src/screens/RoundScreen';
import { SteleScreen } from './src/screens/SteleScreen';
import { FeuilleScreen } from './src/screens/FeuilleScreen';
import { useGameStore } from './src/store/gameStore';
import { palette } from './src/theme/tokens';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const hydrate = useGameStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, []);

  // Les fontes du placard (Anton / IBM Plex Mono / Caveat) — chargées au boot.
  // Les clés = les `fontFamily` de theme/tokens (`fonts.*`). Sans ça, tout
  // retombe en système : « l'affiche » n'existe pas. On attend qu'elles soient
  // prêtes (fond crème, pas de flash de texte système au premier rendu).
  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    Caveat_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: palette.cremePage }} />;
  }

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
