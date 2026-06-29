import React, { useEffect } from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { database } from '@/services/database';
import { useHaptics } from '@/hooks/useHaptics';

export default function SplashIndex() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Trigger logo entrance
    logoScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.back(1.5)),
    });
    logoOpacity.value = withTiming(1, { duration: 800 });

    // Trigger text entrance
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(600, withTiming(0, { duration: 800 }));

    // Soft pulse rotation/scale for backing glow
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    haptics.medium();

    const redirectTimer = setTimeout(() => {
      const isLoggedIn = database.getBoolean('isLoggedIn');
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    }, 2800);

    return () => clearTimeout(redirectTimer);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: logoOpacity.value * 0.4,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  return (
    <LinearGradient
      colors={isDark ? ['#050B14', '#0B1528', '#01050D'] : ['#F4F9FF', '#E1EFFF', '#C9E2FF']}
      style={styles.container}
    >
      {/* Dynamic Animated Glow in the background */}
      <Animated.View style={[styles.glowRing, animatedGlowStyle]} />

      <View style={styles.center}>
        <Animated.View style={[styles.logoOutline, animatedLogoStyle]}>
          <LinearGradient
            colors={['#0F62FE', '#00C6FF']}
            style={styles.logoGradient}
          >
            <Text style={styles.logoLetter}>✈️</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.textGroup, animatedTextStyle]}>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0F62FE' }]}>
            TRAVEL COMPANION
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#00C6FF' : '#33B1FF' }]}>
            A I   A S S I S T A N T
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  center: {
    alignItems: 'center',
    gap: 28,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0F62FE',
    filter: 'blur(50px)',
  },
  logoOutline: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(15, 98, 254, 0.4)',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F62FE',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    fontSize: 44,
  },
  textGroup: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
  },
});
