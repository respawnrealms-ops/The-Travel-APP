import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput, ActivityIndicator, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { Button } from '@/components/Button';
import { PremiumCard } from '@/components/PremiumCard';

interface SecureDoc {
  id: string;
  type: 'Passport' | 'Visa' | 'Insurance' | 'Ticket';
  title: string;
  docNumber: string;
  expiryDate: string;
  isExpiredSoon: boolean;
}

const initialDocs: SecureDoc[] = [
  { id: 'd1', type: 'Passport', title: 'US Passport - John Doe', docNumber: '*********9812', expiryDate: 'Jan 15, 2031', isExpiredSoon: false },
  { id: 'd2', type: 'Visa', title: 'Schengen Tourist Visa', docNumber: 'FR2026-881A', expiryDate: 'Aug 30, 2026', isExpiredSoon: true },
  { id: 'd3', type: 'Insurance', title: 'Allianz Travel Gold', docNumber: 'POL-99102-X', expiryDate: 'Dec 01, 2026', isExpiredSoon: false },
];

export default function DocumentsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [docs, setDocs] = useState<SecureDoc[]>(initialDocs);
  const [isLockLoading, setIsLockLoading] = useState(false);

  const handleUnlock = () => {
    setIsLockLoading(true);
    haptics.medium();
    setTimeout(() => {
      haptics.success();
      setIsUnlocked(true);
      setIsLockLoading(false);
    }, 1200);
  };

  const handleScanSimulate = () => {
    haptics.selection();
    setIsScanning(true);
    // Simulate OCR scanner scanning for 2.5 seconds
    setTimeout(() => {
      haptics.success();
      const scannedDoc: SecureDoc = {
        id: Date.now().toString(),
        type: 'Ticket',
        title: 'Eurostar Ticket Paris-London',
        docNumber: 'E-TKT-ES9021',
        expiryDate: 'Jul 24, 2026',
        isExpiredSoon: false,
      };
      setDocs((prev) => [scannedDoc, ...prev]);
      setIsScanning(false);
    }, 2500);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Pressable onPress={() => { haptics.selection(); router.back(); }} style={styles.backButton}>
            <Ionicons name="close" size={22} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>ENCRYPTED VAULT</Text>
          <Ionicons name="lock-closed" size={18} color="#10B981" />
        </GlassView>
      </View>

      {!isUnlocked ? (
        // Encrypted vault lock screen overlay
        <View style={styles.lockOverlay}>
          <Animated.View entering={FadeInDown.duration(800)} style={styles.lockContent}>
            <View style={styles.shieldCircle}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.shieldGradient}>
                <Ionicons name="shield-half" size={48} color="#ffffff" />
              </LinearGradient>
            </View>
            <Text style={[styles.lockTitle, { color: isDark ? '#ffffff' : '#000000' }]}>Vault Locked</Text>
            <Text style={[styles.lockSub, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
              Biometric authorization or PIN code required to access travel documentation offline.
            </Text>
            
            <Button
              title={isLockLoading ? 'Authorizing...' : 'Authorize Lock'}
              onPress={handleUnlock}
              style={styles.unlockBtn}
            />
          </Animated.View>
        </View>
      ) : isScanning ? (
        // Simulated OCR document scanning view
        <View style={styles.scanContainer}>
          <LinearGradient colors={['#000000', '#0F2027']} style={StyleSheet.absoluteFill} />
          <View style={styles.scannerWrapper}>
            <View style={styles.cameraBox}>
              <View style={styles.targetCornerTL} />
              <View style={styles.targetCornerTR} />
              <View style={styles.targetCornerBL} />
              <View style={styles.targetCornerBR} />
              
              <ActivityIndicator size="large" color="#00C6FF" />
              <Text style={styles.scanFeedbackText}>Align document in focus grid...</Text>
              <Text style={styles.ocrTip}>AI OCR scanner active</Text>
            </View>
          </View>
        </View>
      ) : (
        // Unlocked Documents List
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Scan trigger widget */}
          <Animated.View entering={FadeInDown.duration(800)}>
            <PremiumCard onPress={handleScanSimulate}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.scanBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.scanBannerLeft}>
                  <Ionicons name="scan-outline" size={24} color="#ffffff" />
                  <View>
                    <Text style={styles.scanTitle}>OCR scanner</Text>
                    <Text style={styles.scanText}>Scan physical ticket or passport to store instantly</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color="#ffffff" />
              </LinearGradient>
            </PremiumCard>
          </Animated.View>

          {/* Expiry alerts warnings */}
          {docs.some(d => d.isExpiredSoon) && (
            <Animated.View entering={FadeInDown.duration(800).delay(100)}>
              <GlassView style={styles.alertBanner} borderRadius={20}>
                <Ionicons name="warning-outline" size={22} color="#F59E0B" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>Documents expiring soon</Text>
                  <Text style={styles.alertText}>Your Schengen Tourist Visa expires in less than 60 days.</Text>
                </View>
              </GlassView>
            </Animated.View>
          )}

          {/* Document list */}
          <View style={styles.docsSection}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Secure Folder</Text>
            <View style={styles.docsGrid}>
              {docs.map((doc, idx) => (
                <Animated.View
                  key={doc.id}
                  entering={FadeInDown.duration(600).delay(200 + idx * 100)}
                  layout={Layout.springify()}
                >
                  <GlassView style={styles.docCard} borderRadius={24}>
                    <View style={styles.docRow}>
                      <View style={[styles.docIconBg, { backgroundColor: doc.isExpiredSoon ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)' }]}>
                        <Ionicons
                          name={
                            doc.type === 'Passport'
                              ? 'book-outline'
                              : doc.type === 'Visa'
                              ? 'globe-outline'
                              : doc.type === 'Insurance'
                              ? 'shield-checkmark-outline'
                              : 'receipt-outline'
                          }
                          size={20}
                          color={doc.isExpiredSoon ? '#F59E0B' : '#10B981'}
                        />
                      </View>

                      <View style={styles.docDetails}>
                        <View style={styles.docRowHeader}>
                          <Text style={[styles.docTitleText, { color: isDark ? '#ffffff' : '#000000' }]}>{doc.title}</Text>
                          {doc.isExpiredSoon && (
                            <View style={styles.expiryWarningBadge}>
                              <Text style={styles.expiryWarningBadgeText}>Expired soon</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.docLabelText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
                          No: <Text style={styles.docHighlight}>{doc.docNumber}</Text>
                        </Text>
                        <Text style={[styles.docLabelText, { color: isDark ? '#60646C' : '#90949C' }]}>
                          Expires: {doc.expiryDate}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />

                    <View style={styles.docActions}>
                      <Pressable onPress={() => haptics.light()} style={styles.docActionBtn}>
                        <Ionicons name="eye-outline" size={16} color="#0F62FE" />
                        <Text style={styles.docActionText}>Preview</Text>
                      </Pressable>
                      <Pressable onPress={() => haptics.light()} style={styles.docActionBtn}>
                        <Ionicons name="download-outline" size={16} color={isDark ? '#B0B4BA' : '#60646C'} />
                        <Text style={[styles.docActionText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Export</Text>
                      </Pressable>
                    </View>
                  </GlassView>
                </Animated.View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
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
  lockOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lockContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 16,
  },
  shieldCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  lockSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  unlockBtn: {
    width: '100%',
    marginTop: 12,
  },
  scanBanner: {
    borderRadius: 28,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  scanTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  scanText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  alertTitle: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '800',
  },
  alertText: {
    color: 'rgba(245, 158, 11, 0.8)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  docsSection: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  docsGrid: {
    gap: 12,
  },
  docCard: {
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  docRow: {
    flexDirection: 'row',
    gap: 14,
  },
  docIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docDetails: {
    flex: 1,
    gap: 2,
  },
  docRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docTitleText: {
    fontSize: 15,
    fontWeight: '800',
  },
  expiryWarningBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  expiryWarningBadgeText: {
    color: '#F59E0B',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  docLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  docHighlight: {
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  docActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  docActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  docActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F62FE',
  },

  // Simulated OCR camera scanner styling
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerWrapper: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 3 / 4,
    borderWidth: 2,
    borderColor: 'rgba(0,198,255,0.3)',
    borderRadius: 28,
    overflow: 'hidden',
  },
  cameraBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 24,
  },
  targetCornerTL: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00C6FF',
  },
  targetCornerTR: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00C6FF',
  },
  targetCornerBL: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00C6FF',
  },
  targetCornerBR: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00C6FF',
  },
  scanFeedbackText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  ocrTip: {
    color: '#00C6FF',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 6,
  },
});
