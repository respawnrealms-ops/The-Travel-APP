import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform, useColorScheme, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { database } from '@/services/database';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { PremiumCard } from '@/components/PremiumCard';
import { weatherService } from '@/services/weather';

interface TripItem {
  id: string;
  destination: string;
  country: string;
  dates: string;
  daysToDeparture: number;
  imageColor: string[];
}

const mockTrips: TripItem[] = [
  {
    id: 'paris-2026',
    destination: 'Paris',
    country: 'France',
    dates: 'July 15 - July 22, 2026',
    daysToDeparture: 17,
    imageColor: ['#1A2980', '#26D0CE'],
  },
  {
    id: 'tokyo-2026',
    destination: 'Tokyo',
    country: 'Japan',
    dates: 'Oct 10 - Oct 20, 2026',
    daysToDeparture: 104,
    imageColor: ['#f857a6', '#ff5858'],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  const [greeting] = useState(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning, traveler';
    if (hours < 18) return 'Good afternoon, traveler';
    return 'Good evening, traveler';
  });
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    'Always keep a digital backup of your passport in your encrypted vault.',
    'Use local currency for card transactions to bypass expensive retail markups.',
    'Pack rolling cylinders of clothing rather than flat folds to save 30% luggage space.',
    'Search for lunch specials ("formules") at luxury restaurants to save up to 50%.',
  ];

  useEffect(() => {
    // Load default settings if unset
    if (database.getString('trips') === undefined) {
      database.setString('trips', JSON.stringify(mockTrips));
    }
  }, []);

  const handleQuickAction = (route: string) => {
    haptics.selection();
    router.push(route as any);
  };

  const nextTrip = mockTrips[0];
  const weatherPreview = weatherService.getWeather(nextTrip.destination).current;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 12) + 12,
            paddingHorizontal: isCompact ? 14 : 20,
            paddingBottom: Math.max(insets.bottom + 128, 148),
            gap: isCompact ? 20 : 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Greeting */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
          <View>
            <Text style={[styles.greetingText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
              {greeting}
            </Text>
            <Text style={[styles.appName, { color: isDark ? '#ffffff' : '#0F62FE' }]}>
              Travel Companion
            </Text>
          </View>
          <Pressable
            onPress={() => handleQuickAction('/settings')}
            style={[styles.profileButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)' }]}
          >
            <Ionicons name="person-outline" size={20} color={isDark ? '#ffffff' : '#0F62FE'} />
          </Pressable>
        </Animated.View>

        {/* Main Banner / Trip Countdown */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <PremiumCard
            onPress={() => router.push({ pathname: '/trip-details', params: { id: nextTrip.id } })}
            style={[styles.bannerCard, isCompact && styles.bannerCardCompact]}
          >
            <LinearGradient
              colors={nextTrip.imageColor as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bannerGradient, isCompact && styles.bannerGradientCompact]}
            >
              <View style={styles.bannerContent}>
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.countdownTitle}>Upcoming Trip</Text>
                  <Text style={[styles.bannerDestination, isCompact && styles.bannerDestinationCompact]}>
                    {nextTrip.destination}, {nextTrip.country}
                  </Text>
                  <Text style={styles.bannerDates}>{nextTrip.dates}</Text>
                </View>
                
                {/* Circular Indicator Mockup */}
                <View style={[styles.countdownCircle, isCompact && styles.countdownCircleCompact]}>
                  <Text style={[styles.countdownDays, isCompact && styles.countdownDaysCompact]}>{nextTrip.daysToDeparture}</Text>
                  <Text style={styles.countdownLabel}>days left</Text>
                </View>
              </View>

              {/* Weather preview footer inside card */}
              <GlassView style={styles.bannerFooter} borderRadius={18}>
                <Ionicons name={weatherPreview.icon === 'sunny' ? 'sunny' : 'partly-sunny'} size={20} color="#ffffff" />
                <Text style={styles.bannerFooterText}>
                  Forecast: {weatherPreview.temp}°C, {weatherPreview.condition} in {nextTrip.destination}
                </Text>
              </GlassView>
            </LinearGradient>
          </PremiumCard>
        </Animated.View>

        {/* Quick Actions Grid */}
        <Animated.View entering={FadeInDown.duration(800).delay(300)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Quick Actions</Text>
          <View style={styles.grid}>
            <Pressable
              onPress={() => handleQuickAction('/weather')}
              style={[styles.gridCell, isCompact && styles.gridCellCompact, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
            >
              <Ionicons name="thunderstorm-outline" size={24} color="#00C6FF" />
              <Text style={[styles.gridCellText, { color: isDark ? '#ffffff' : '#333' }]}>Weather</Text>
            </Pressable>

            <Pressable
              onPress={() => handleQuickAction('/currency')}
              style={[styles.gridCell, isCompact && styles.gridCellCompact, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
            >
              <Ionicons name="cash-outline" size={24} color="#0F62FE" />
              <Text style={[styles.gridCellText, { color: isDark ? '#ffffff' : '#333' }]}>Currency</Text>
            </Pressable>

            <Pressable
              onPress={() => handleQuickAction('/documents')}
              style={[styles.gridCell, isCompact && styles.gridCellCompact, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
            >
              <Ionicons name="lock-closed-outline" size={24} color="#10B981" />
              <Text style={[styles.gridCellText, { color: isDark ? '#ffffff' : '#333' }]}>Vault</Text>
            </Pressable>

            <Pressable
              onPress={() => handleQuickAction('/premium')}
              style={[styles.gridCell, isCompact && styles.gridCellCompact, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
            >
              <Ionicons name="diamond-outline" size={24} color="#F59E0B" />
              <Text style={[styles.gridCellText, { color: isDark ? '#ffffff' : '#333' }]}>Premium</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Trips Slider */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Your Itineraries</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {mockTrips.map((trip) => (
              <View key={trip.id} style={styles.slideCardContainer}>
                <PremiumCard
                  onPress={() => router.push({ pathname: '/trip-details', params: { id: trip.id } })}
                  style={styles.slideCard}
                >
                  <LinearGradient colors={trip.imageColor as [string, string]} style={styles.slideGradient}>
                    <Text style={styles.slideDestination}>{trip.destination}</Text>
                    <Text style={styles.slideDates}>{trip.dates}</Text>
                    <View style={styles.slideBadge}>
                      <Text style={styles.slideBadgeText}>{trip.daysToDeparture} days</Text>
                    </View>
                  </LinearGradient>
                </PremiumCard>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Dynamic Tip of the Day */}
        <Animated.View entering={FadeInDown.duration(800).delay(500)}>
          <GlassView style={styles.tipCard} borderRadius={24}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb-outline" size={18} color="#0F62FE" />
              <Text style={[styles.tipTitle, { color: isDark ? '#00C6FF' : '#0F62FE' }]}>AI Travel Tip</Text>
            </View>
            <Text style={[styles.tipText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
              {tips[tipIndex]}
            </Text>
            <Pressable
              onPress={() => {
                haptics.light();
                setTipIndex((prev) => (prev + 1) % tips.length);
              }}
              style={styles.nextTipButton}
            >
              <Text style={styles.nextTipText}>Next Tip</Text>
              <Ionicons name="arrow-forward-outline" size={12} color="#0F62FE" />
            </Pressable>
          </GlassView>
        </Animated.View>
      </ScrollView>

      {/* Floating AI Button */}
      <Animated.View entering={FadeIn.delay(800)} style={styles.floatingButtonContainer}>
        <Pressable
          onPress={() => {
            haptics.medium();
            router.push('/(tabs)/ai-planner');
          }}
          style={styles.floatingButton}
        >
          <LinearGradient
            colors={['#0F62FE', '#00C6FF']}
            style={styles.floatingGradient}
          >
            <Ionicons name="sparkles" size={24} color="#ffffff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 148,
    gap: 28,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCard: {
    height: 198,
  },
  bannerCardCompact: {
    height: 178,
  },
  bannerGradient: {
    flex: 1,
    borderRadius: 28,
    padding: 24,
    gap: 20,
    position: 'relative',
    justifyContent: 'space-between',
  },
  bannerGradientCompact: {
    padding: 18,
    gap: 14,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    gap: 4,
  },
  countdownTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerDestination: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    flexShrink: 1,
  },
  bannerDestinationCompact: {
    fontSize: 20,
  },
  bannerDates: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  countdownCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownCircleCompact: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  countdownDays: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  countdownDaysCompact: {
    fontSize: 18,
  },
  countdownLabel: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bannerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  bannerFooterText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  sectionContainer: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCell: {
    flex: 1,
    height: 84,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  gridCellCompact: {
    flexBasis: '47%',
  },
  gridCellText: {
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalScroll: {
    gap: 14,
  },
  slideCardContainer: {
    width: 240,
  },
  slideCard: {
    height: 140,
  },
  slideGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    padding: 20,
    justifyContent: 'space-between',
  },
  slideDestination: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  slideDates: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  slideBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  slideBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  tipCard: {
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  nextTipButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  nextTipText: {
    fontSize: 12,
    color: '#0F62FE',
    fontWeight: '700',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 104 : 96,
    right: 16,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#0F62FE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  floatingGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
