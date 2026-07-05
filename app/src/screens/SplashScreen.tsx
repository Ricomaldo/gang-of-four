/**
 * Splash — ouverture de marque, dragon plein écran (asset fourni par Eric).
 * Court, enchaîne directement sur l'écran manche/démarrage. Un tap peut le sauter.
 * Placeholder ici : l'asset dragon définitif sera branché plus tard.
 */
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { palette } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Round'), 1400);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <Pressable style={styles.wrap} onPress={() => navigation.replace('Round')}>
      <Text style={styles.dragon}>🐉</Text>
      <Text style={styles.title}>Gang of Four</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.fondCreme },
  dragon: { fontSize: 96 },
  title: { fontSize: 24, color: palette.encre, marginTop: 12, letterSpacing: 1 },
});
