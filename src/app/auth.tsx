import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Platform, useColorScheme, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { database } from '@/services/database';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { Button } from '@/components/Button';

export default function AuthScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const handleEmailLogin = () => {
    if (!email || !password) {
      haptics.error();
      alert('Please fill in both fields.');
      return;
    }
    setIsLoading(true);
    haptics.selection();
    setTimeout(() => {
      database.setBoolean('isLoggedIn', true);
      haptics.success();
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleBiometricLogin = () => {
    setIsBiometricLoading(true);
    haptics.medium();
    setTimeout(() => {
      database.setBoolean('isLoggedIn', true);
      haptics.success();
      setIsBiometricLoading(false);
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0F2027', '#203A43', '#2C5364'] : ['#E0F7FA', '#B2EBF2', '#80DEEA']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Top Branding Section */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(800)} 
          style={styles.logoContainer}
        >
          <View style={styles.iconRing}>
            <LinearGradient
              colors={['#0F62FE', '#00C6FF']}
              style={styles.logoGradient}
            >
              <Ionicons name="airplane-outline" size={40} color="#ffffff" style={styles.airplaneIcon} />
            </LinearGradient>
          </View>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0F62FE' }]}>
            Travel Companion AI
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
            Your premium journey starts here
          </Text>
        </Animated.View>

        {/* Input Card Container */}
        <Animated.View entering={FadeInDown.delay(300).duration(800)}>
          <GlassView style={styles.card} borderRadius={28}>
            <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>
              Welcome back
            </Text>
            
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                <Ionicons name="mail-outline" size={20} color={isDark ? '#B0B4BA' : '#60646C'} />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={isDark ? '#60646C' : '#90949C'}
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { color: isDark ? '#ffffff' : '#000000' }]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={[styles.inputWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#B0B4BA' : '#60646C'} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={isDark ? '#60646C' : '#90949C'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={[styles.input, { color: isDark ? '#ffffff' : '#000000' }]}
                />
              </View>
            </View>

            <Button
              title={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleEmailLogin}
              style={styles.loginButton}
            />

            <View style={styles.dividerRow}>
              <View style={[styles.line, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
              <Text style={[styles.dividerText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>or continue with</Text>
              <View style={[styles.line, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
            </View>

            {/* Quick Actions / Biometric Row */}
            <View style={styles.socialRow}>
              <Pressable
                onPress={handleBiometricLogin}
                style={[styles.socialButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
              >
                {isBiometricLoading ? (
                  <ActivityIndicator size="small" color="#0F62FE" />
                ) : (
                  <Ionicons name="finger-print-outline" size={24} color="#0F62FE" />
                )}
                <Text style={[styles.socialButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>
                  {Platform.OS === 'ios' ? 'Face ID' : 'Biometrics'}
                </Text>
              </Pressable>
            </View>
          </GlassView>
        </Animated.View>

        {/* Demo Mode Button */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(800)}
          style={styles.demoModeContainer}
        >
          <Pressable
            onPress={() => {
              haptics.selection();
              database.setBoolean('isLoggedIn', true);
              router.replace('/(tabs)');
            }}
            style={styles.demoModeButton}
          >
            <Text style={styles.demoModeText}>Enter in Guest Mode</Text>
            <Ionicons name="arrow-forward-outline" size={16} color="#00C6FF" />
          </Pressable>
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
  },
  content: {
    width: Platform.OS === 'web' ? 420 : '90%',
    maxWidth: 440,
    gap: 36,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  iconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(15, 98, 254, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  airplaneIcon: {
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  card: {
    padding: 32,
    gap: 24,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputContainer: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  socialRow: {
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '100%',
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  demoModeContainer: {
    alignItems: 'center',
  },
  demoModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  demoModeText: {
    color: '#00C6FF',
    fontSize: 14,
    fontWeight: '600',
  },
});
