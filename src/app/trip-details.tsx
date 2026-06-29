import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform, useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { PremiumCard } from '@/components/PremiumCard';
import { Button } from '@/components/Button';
import { TravelMap } from '@/components/TravelMap';

interface TimelineItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant' | 'train';
  time: string;
  title: string;
  location: string;
  notes: string;
  price?: string;
}

const mockTimelineData: Record<string, TimelineItem[]> = {
  'paris-2026': [
    {
      id: 'item-1',
      type: 'flight',
      time: '08:40 AM',
      title: 'Flight AF371 to Paris (CDG)',
      location: 'JFK Airport Terminal 4',
      notes: 'Boarding starts at 07:55 AM. Seat 12A. Gate B22.',
      price: '$650.00',
    },
    {
      id: 'item-2',
      type: 'hotel',
      time: '03:00 PM',
      title: 'Hotel Regina Louvre Check-in',
      location: '2 Place des Pyramides, 75001 Paris',
      notes: 'Booking confirmation: #REG-99120. Breakfast included.',
      price: '€280/night',
    },
    {
      id: 'item-3',
      type: 'restaurant',
      time: '07:30 PM',
      title: 'Dinner at Le Comptoir de La Relais',
      location: '9 Carrefour de l\'Odéon, 75006 Paris',
      notes: 'No reservations accepted; arrive 30 mins early to queue.',
      price: '€52.00',
    },
    {
      id: 'item-4',
      type: 'activity',
      time: '10:00 AM (Day 2)',
      title: 'Louvre Museum Tour',
      location: 'Rue de Rivoli, 75001 Paris',
      notes: 'Skip-the-line ticket barcode is stored in your vault folder.',
      price: '€22.00',
    },
  ],
  'tokyo-2026': [
    {
      id: 'item-1',
      type: 'flight',
      time: '11:15 AM',
      title: 'Flight NH110 to Tokyo (HND)',
      location: 'LAX Airport Terminal TBIT',
      notes: 'Boarding starts at 10:30 AM. Seat 28K. Gate 152.',
      price: '$920.00',
    },
    {
      id: 'item-2',
      type: 'hotel',
      time: '04:00 PM',
      title: 'Park Hyatt Tokyo Check-in',
      location: '3-7-1-2 Nishi-Shinjuku, Tokyo',
      notes: 'Booking reference: #PHY-3301. Peak view king suite.',
      price: '¥55,000/night',
    },
    {
      id: 'item-3',
      type: 'activity',
      time: '09:30 AM (Day 2)',
      title: 'Shibuya Sky Deck Observatory',
      location: 'Shibuya Scramble Square',
      notes: 'Best photography views. Must scan QR code at the entrance.',
      price: '¥2,200',
    },
  ],
};

export default function TripDetailsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { id } = useLocalSearchParams<{ id: string }>();

  const tripId = id || 'paris-2026';
  const insets = useSafeAreaInsets();
  const timeline = mockTimelineData[tripId] || mockTimelineData['paris-2026'];
  const destinationName = tripId.split('-')[0].toUpperCase();

  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return 'airplane-outline';
      case 'hotel':
        return 'bed-outline';
      case 'activity':
        return 'camera-outline';
      case 'restaurant':
        return 'restaurant-outline';
      case 'train':
        return 'train-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'flight': return '#0F62FE';
      case 'hotel': return '#10B981';
      case 'activity': return '#F59E0B';
      case 'restaurant': return '#EF4444';
      default: return '#8B5CF6';
    }
  };

  const handleTimelinePress = (itemId: string) => {
    haptics.light();
    setExpandedItem((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Premium Parallax-like Floating Header */}
      <View style={styles.topHeader}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Pressable onPress={() => { haptics.selection(); router.back(); }} style={styles.headerButton}>
            <Ionicons name="arrow-back-outline" size={22} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>{destinationName} TIMELINE</Text>
          <Pressable onPress={() => haptics.medium()} style={styles.headerButton}>
            <Ionicons name="share-outline" size={22} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
        </GlassView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Parallax Hero Image Card */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.heroWrapper}>
          <LinearGradient
            colors={tripId.includes('paris') ? ['#1A2980', '#26D0CE'] : ['#f857a6', '#ff5858']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroDestination}>{destinationName}</Text>
              <Text style={styles.heroDates}>7-Day Exploration Itinerary</Text>
              <View style={styles.badgeRow}>
                <View style={styles.heroBadge}>
                  <Ionicons name="partly-sunny-outline" size={14} color="#ffffff" />
                  <Text style={styles.heroBadgeText}>22°C Partly Cloudy</Text>
                </View>
                <View style={[styles.heroBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name="wallet-outline" size={14} color="#ffffff" />
                  <Text style={styles.heroBadgeText}>Budget: 84% safe</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Real Route Map */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)}>
          <GlassView style={styles.mapCard} borderRadius={28}>
            <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Trip Route Map</Text>
            <TravelMap
              height={220}
              darkMode={isDark}
              zoom={12}
              centerLat={48.8566}
              centerLng={2.3522}
              markers={
                tripId.includes('paris')
                  ? [
                      { lat: 48.8584, lng: 2.2945, label: 'Eiffel Tower', color: '#10B981' },
                      { lat: 48.8606, lng: 2.3376, label: 'Hotel Regina Louvre', color: '#F59E0B' },
                      { lat: 48.8602, lng: 2.3477, label: 'Louvre Museum', color: '#8B5CF6' },
                      { lat: 48.8462, lng: 2.3965, label: 'Le Marais', color: '#EF4444' },
                    ]
                  : [
                      { lat: 35.6585, lng: 139.7454, label: 'Shibuya', color: '#10B981' },
                      { lat: 35.6762, lng: 139.6503, label: 'Shinjuku', color: '#F59E0B' },
                      { lat: 35.7148, lng: 139.7967, label: 'Asakusa', color: '#EF4444' },
                    ]
              }
            />
          </GlassView>
        </Animated.View>

        {/* Vertical Timeline Checkpoint List */}
        <View style={styles.timelineSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Scheduled Stops</Text>
          {timeline.map((item, index) => {
            const isExpanded = expandedItem === item.id;
            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.duration(600).delay(index * 100)}
                layout={Layout.springify()}
                style={styles.timelineRow}
              >
                {/* Bullet point & connecting line */}
                <View style={styles.bulletCol}>
                  <View style={[styles.bulletIcon, { backgroundColor: getIconBg(item.type) }]}>
                    <Ionicons name={getTimelineIcon(item.type)} size={16} color="#ffffff" />
                  </View>
                  {index < timeline.length - 1 && <View style={[styles.connectingLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]} />}
                </View>

                {/* Glass Card content */}
                <Pressable onPress={() => handleTimelinePress(item.id)} style={styles.cardCol}>
                  <GlassView style={styles.timelineCard} borderRadius={20}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.timeText}>{item.time}</Text>
                      {item.price && <Text style={[styles.priceTag, { color: isDark ? '#00C6FF' : '#0F62FE' }]}>{item.price}</Text>}
                    </View>
                    <Text style={[styles.itemTitle, { color: isDark ? '#ffffff' : '#000000' }]}>{item.title}</Text>
                    <Text style={[styles.itemLocation, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
                      📍 {item.location}
                    </Text>

                    {isExpanded && (
                      <Animated.View entering={FadeIn.duration(300)} style={styles.expandedContent}>
                        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]} />
                        <Text style={[styles.notesText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
                          {item.notes}
                        </Text>
                      </Animated.View>
                    )}
                  </GlassView>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Local Assistance / Emergency Quick-dials */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)}>
          <GlassView style={styles.emergencyCard} borderRadius={24}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#EF4444" />
              <Text style={styles.emergencyTitle}>Local Assistance</Text>
            </View>
            <Text style={[styles.emergencyText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
              Access safety contacts for France immediately. Call local emergency dials without network.
            </Text>
            <View style={styles.emergencyButtonsRow}>
              <Button
                title="Call 112"
                onPress={() => haptics.heavy()}
                variant="glass"
                style={styles.emergencyBtn}
                textStyle={{ color: '#EF4444' }}
              />
              <Button
                title="Consulate info"
                onPress={() => haptics.medium()}
                variant="glass"
                style={styles.emergencyBtn}
              />
            </View>
          </GlassView>
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
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    zIndex: 100,
  },
  headerBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    paddingBottom: 60,
    gap: 24,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  heroWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 32,
    height: 200,
    justifyContent: 'flex-end',
  },
  heroContent: {
    gap: 6,
  },
  heroDestination: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroDates: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  mapCard: {
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  svgWrapper: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  mapDetails: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  nodeLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  timelineSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  bulletCol: {
    alignItems: 'center',
  },
  bulletIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 2,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  cardCol: {
    flex: 1,
  },
  timelineCard: {
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: '#0F62FE',
    fontWeight: '700',
  },
  priceTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemLocation: {
    fontSize: 12,
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 10,
    gap: 8,
  },
  divider: {
    height: 1,
  },
  notesText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  emergencyCard: {
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.1)',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyTitle: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emergencyText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  emergencyButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  emergencyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
  },
});
