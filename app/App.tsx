/**
 * Racine de l'app — container de navigation + stack unique.
 * Splash → Round (écran manche / démarrage). ScoreEntry et ScoreGrid en modals.
 */
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RoundScreen } from './src/screens/RoundScreen';
import { ScoreEntryScreen } from './src/screens/ScoreEntryScreen';
import { ScoreGridScreen } from './src/screens/ScoreGridScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Round" component={RoundScreen} />
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="ScoreEntry" component={ScoreEntryScreen} />
            <Stack.Screen name="ScoreGrid" component={ScoreGridScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
