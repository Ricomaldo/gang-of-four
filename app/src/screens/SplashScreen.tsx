/* ═══ RESHAPE 0.2 · TAG [†] supprimé ═══
 * Cible : remplacé par L'ACCUEIL [N] (manchette · disque-GANG 4c · tes gangs).
 * Lot : lot 3 — plan : app/docs/journal/2026-07-12-plan-integration.md.
 * Specs : app/docs/specs/specs-ecrans.md · signature/reshape.md (fait foi). Dev gelé jusqu'au dégel (Eric déclare).
 * ═══════════════════════════════ */
/**
 * Splash — ouverture de marque, dragon plein écran (asset fourni par Eric).
 * Court, enchaîne directement sur le Round (stopgap lot 1 : le Round gère
 * nommer/reprise lui-même, cf. App.tsx). Un tap peut le sauter.
 * Placeholder ici : l'asset dragon définitif sera branché plus tard.
 */
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
      <View style={styles.logoStack}>
        <Image source={require('../../assets/official/gang-of-four.webp')} style={styles.logo} />
        <Image
          source={require('../../assets/official/game-box.webp')}
          style={[styles.logo, styles.logoSpacing]}
        />
      </View>      
      {/* <Text style={styles.title}>Score Sheet</Text> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.fondCreme },
  logoStack: { alignItems: 'center' },
  logo: { width: 300, height: 300, resizeMode: 'contain' },
  logoSpacing: { marginBottom: 18 },
});
