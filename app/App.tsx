/**
 * Racine de l'app — container de navigation + stack unique.
 * Splash → Round (écran manche / démarrage). ScoreEntry et ScoreGrid en modals.
 */
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RoundScreen } from './src/screens/RoundScreen';
import { ScoreEntryScreen } from './src/screens/ScoreEntryScreen';
import { ScoreGridScreen } from './src/screens/ScoreGridScreen';
import { SetupScreen } from './src/screens/SetupScreen';
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
          {/* Splash → Setup → Round partagent le layout 2×2 : fondu plutôt que
              push latéral, pour lire comme une continuité (pas une page qui pousse
              sa jumelle). Les modals gardent leur montée depuis le bas. */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Setup" component={SetupScreen} options={{ animation: 'fade' }} />
          <Stack.Screen name="Round" component={RoundScreen} options={{ animation: 'fade' }} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="ScoreEntry" component={ScoreEntryScreen} />
            <Stack.Screen name="ScoreGrid" component={ScoreGridScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
