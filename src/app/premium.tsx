import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, useColorScheme, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { Button } from '@/components/Button';
import { database } from '@/services/database';

interface PlanOption {
  id: string;
  name: string;
  price: string;
  billing: string;
  badge?: string;
}

export default function PremiumScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();

  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const plans: PlanOption[] = [
    { id: 'monthly', name: 'Monthly Access', price: '€12.99', billing: 'billed monthly' },
    { id: 'annual', name: 'Annual Gold Pass', price: '€59.99', billing: 'billed annually', badge: 'Save 60%' },
    { id: 'lifetime', name: 'Lifetime Prestige', price: '€149.99', billing: 'one-time payment' },
  ];

  const handleSubscribe = () => {
    haptics.medium();
    setIsPurchasing(true);
    setTimeout(() => {
      haptics.success();
      database.setBoolean('isPremium', true);
      setIsPurchasing(false);
      alert('Prestige Premium Active! Welcome to Gold Pass benefits.');
      router.back();
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* High-end Midnight Background */}
      <LinearGradient colors={['#050B14', '#0F121C', '#010307']} style={StyleSheet.absoluteFill} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable onPress={() => { haptics.selection(); router.back(); }} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Diamond Title Card */}
        <Animated.View entering={ZoomIn.duration(800)} style={styles.brandingCol}>
          <View style={styles.diamondRing}>
            <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.diamondGradient}>
              <Ionicons name="diamond" size={32} color="#ffffff" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>GOLD PASS PRESTIGE</Text>
          <Text style={styles.subtitle}>Unlock the ultimate Apple-designed travel companion AI</Text>
        </Animated.View>

        {/* Benefits Grid */}
        <View style={styles.benefitsGrid}>
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <GlassView style={styles.benefitCell} borderRadius={20} intensity={25}>
              <Ionicons name="sparkles" size={22} color="#F59E0B" />
              <View style={styles.benefitTextCol}>
                <Text style={styles.benefitTitle}>Unlimited AI Planning</Text>
                <Text style={styles.benefitDesc}>Itineraries, translation, budget solvers, and packing</Text>
              </View>
            </GlassView>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(300)}>
            <GlassView style={styles.benefitCell} borderRadius={20} intensity={25}>
              <Ionicons name="cloud-offline-outline" size={22} color="#00C6FF" />
              <View style={styles.benefitTextCol}>
                <Text style={styles.benefitTitle}>Offline Map Datasets</Text>
                <Text style={styles.benefitDesc}>Browse cities, schedules, and menus without roaming data</Text>
              </View>
            </GlassView>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(600).delay(400)}>
            <GlassView style={styles.benefitCell} borderRadius={20} intensity={25}>
              <Ionicons name="lock-closed-outline" size={22} color="#10B981" />
              <View style={styles.benefitTextCol}>
                <Text style={styles.benefitTitle}>Encrypted Documents Vault</Text>
                <Text style={styles.benefitDesc}>AES-GCM-256 secure offline folders & biometric scans</Text>
              </View>
            </GlassView>
          </Animated.View>
        </View>

        {/* Pricing Cards Selection Slider */}
        <View style={styles.pricingSection}>
          {plans.map((plan, idx) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <Animated.View key={plan.id} entering={FadeInDown.duration(600).delay(500 + idx * 100)}>
                <Pressable
                  onPress={() => { haptics.light(); setSelectedPlan(plan.id); }}
                  style={[
                    styles.planCardWrapper,
                    isSelected && styles.planCardActiveBorder,
                  ]}
                >
                  <GlassView
                    style={[
                      styles.planCard,
                      isSelected && { backgroundColor: 'rgba(245, 158, 11, 0.08)' },
                    ]}
                    borderRadius={24}
                    intensity={20}
                  >
                    <View style={styles.planHeader}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      {plan.badge && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{plan.badge}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.planFooter}>
                      <View>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        <Text style={styles.planBilling}>{plan.billing}</Text>
                      </View>
                      
                      <View style={[styles.selectCircle, isSelected && styles.selectCircleActive]}>
                        {isSelected && <View style={styles.selectDot} />}
                      </View>
                    </View>
                  </GlassView>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Purchase Buttons */}
        <Animated.View entering={FadeInDown.duration(800).delay(800)} style={styles.actionCol}>
          <Button
            title={isPurchasing ? 'Processing Transaction...' : 'Activate Gold Pass'}
            onPress={handleSubscribe}
            style={styles.subscribeBtn}
          />
          <Text style={styles.termsText}>
            Restore Purchases • Terms of Service • Privacy Policy
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Simulated Apple pay/Biometric Sheet */}
      {isPurchasing && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.sheetOverlay}>
          <View style={styles.paySheet}>
            <Ionicons name="logo-apple" size={32} color="#000000" />
            <Text style={styles.payTitle}>Apple Pay Verification</Text>
            <Text style={styles.payDesc}>Double Click to Confirm Subscribing to Gold Pass</Text>
            
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Total Charge</Text>
              <Text style={styles.payVal}>
                {plans.find((p) => p.id === selectedPlan)?.price}
              </Text>
            </View>

            <ActivityIndicator size="large" color="#0F62FE" style={{ marginVertical: 12 }} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 100,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 60,
    gap: 32,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  brandingCol: {
    alignItems: 'center',
    gap: 12,
  },
  diamondRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
  benefitsGrid: {
    gap: 12,
  },
  benefitCell: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  benefitTextCol: {
    flex: 1,
    gap: 2,
  },
  benefitTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  benefitDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  pricingSection: {
    gap: 12,
  },
  planCardWrapper: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  planCardActiveBorder: {
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  planCard: {
    padding: 20,
    gap: 14,
    borderWidth: 0,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  badge: {
    backgroundColor: '#F59E0B',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  badgeText: {
    color: '#050B14',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planPrice: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  planBilling: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  selectCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectCircleActive: {
    borderColor: '#F59E0B',
    backgroundColor: 'transparent',
  },
  selectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
  },
  actionCol: {
    alignItems: 'center',
    gap: 16,
  },
  subscribeBtn: {
    width: '100%',
  },
  termsText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
  },
  // Apple Pay sheet overlay
  sheetOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  paySheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  payTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  payDesc: {
    color: '#60646C',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
    marginTop: 12,
  },
  payLabel: {
    color: '#60646C',
    fontSize: 14,
    fontWeight: '600',
  },
  payVal: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
});
