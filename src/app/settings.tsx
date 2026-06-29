import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { Button } from '@/components/Button';
import { database } from '@/services/database';

export default function SettingsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [activeTheme, setActiveTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [isClearing, setIsClearing] = useState(false);
  const [cacheSize, setCacheSize] = useState('4.2 MB');

  const handleThemeChange = (theme: 'system' | 'light' | 'dark') => {
    haptics.selection();
    setActiveTheme(theme);
    database.setString('theme', theme);
  };

  const handleClearCache = () => {
    haptics.medium();
    setIsClearing(true);
    setTimeout(() => {
      haptics.success();
      setCacheSize('0.0 KB');
      setIsClearing(false);
    }, 1500);
  };

  const handleLogout = () => {
    haptics.medium();
    database.delete('isLoggedIn');
    router.replace('/auth');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Pressable onPress={() => { haptics.selection(); router.back(); }} style={styles.backButton}>
            <Ionicons name="close" size={22} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>PREFERENCES</Text>
          <Ionicons name="cog-outline" size={18} color={isDark ? '#ffffff' : '#000000'} />
        </GlassView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <GlassView style={styles.profileCard} borderRadius={28}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarRing}>
                <Ionicons name="person" size={28} color="#0F62FE" />
              </View>
              <View style={styles.profileText}>
                <Text style={[styles.profileName, { color: isDark ? '#ffffff' : '#000000' }]}>John Doe</Text>
                <View style={styles.premiumBadge}>
                  <Ionicons name="diamond-outline" size={10} color="#F59E0B" />
                  <Text style={styles.premiumBadgeText}>Premium Explorer</Text>
                </View>
              </View>
            </View>
          </GlassView>
        </Animated.View>

        {/* Theme Settings */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Visual Mode</Text>
          <GlassView style={styles.themeCard} borderRadius={24}>
            {(['system', 'light', 'dark'] as const).map((mode) => {
              const isActive = activeTheme === mode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => handleThemeChange(mode)}
                  style={[
                    styles.themeRow,
                    isActive && { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15, 98, 254, 0.05)' },
                  ]}
                >
                  <View style={styles.themeLeft}>
                    <Ionicons
                      name={
                        mode === 'system'
                          ? 'phone-portrait-outline'
                          : mode === 'light'
                          ? 'sunny-outline'
                          : 'moon-outline'
                      }
                      size={18}
                      color={isActive ? '#0F62FE' : isDark ? '#B0B4BA' : '#60646C'}
                    />
                    <Text style={[styles.themeText, { color: isActive ? '#0F62FE' : isDark ? '#ffffff' : '#333' }]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                    </Text>
                  </View>
                  {isActive && <Ionicons name="checkmark-circle" size={20} color="#0F62FE" />}
                </Pressable>
              );
            })}
          </GlassView>
        </Animated.View>

        {/* Cache & System Storage Settings */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Storage & Cache</Text>
          <GlassView style={styles.cacheCard} borderRadius={24}>
            <View style={styles.cacheRow}>
              <View style={styles.cacheLeft}>
                <Ionicons name="server-outline" size={18} color={isDark ? '#B0B4BA' : '#60646C'} />
                <View>
                  <Text style={[styles.cacheTitle, { color: isDark ? '#ffffff' : '#333' }]}>Offline Maps & Rates</Text>
                  <Text style={[styles.cacheSub, { color: isDark ? '#60646C' : '#90949C' }]}>Cached travel indices</Text>
                </View>
              </View>
              <Text style={[styles.cacheSize, { color: isDark ? '#ffffff' : '#000000' }]}>{cacheSize}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />

            <Button
              title={isClearing ? 'Clearing Storage...' : 'Wipe Cache Database'}
              onPress={handleClearCache}
              variant="secondary"
              style={styles.clearBtn}
            />
          </GlassView>
        </Animated.View>

        {/* Security & System Information */}
        <Animated.View entering={FadeInDown.duration(800).delay(300)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>About App</Text>
          <GlassView style={styles.infoCard} borderRadius={24}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>App Version</Text>
              <Text style={[styles.infoVal, { color: isDark ? '#ffffff' : '#000000' }]}>v1.0.0 Stable</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Encryption Target</Text>
              <Text style={[styles.infoVal, { color: isDark ? '#ffffff' : '#000000' }]}>AES-GCM-256</Text>
            </View>
          </GlassView>
        </Animated.View>

        {/* Log Out Button */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)}>
          <Button
            title="Log Out Security Session"
            onPress={handleLogout}
            style={styles.logoutBtn}
            textStyle={{ color: '#EF4444' }}
            variant="glass"
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 100,
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 60,
    gap: 24,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  profileCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(15, 98, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 4,
  },
  premiumBadgeText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginLeft: 4,
  },
  themeCard: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 52,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cacheCard: {
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cacheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cacheLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cacheTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cacheSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  cacheSize: {
    fontSize: 14,
    fontWeight: '800',
  },
  divider: {
    height: 1,
  },
  clearBtn: {
    height: 48,
    borderRadius: 16,
  },
  infoCard: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    height: 54,
    borderRadius: 20,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
});
