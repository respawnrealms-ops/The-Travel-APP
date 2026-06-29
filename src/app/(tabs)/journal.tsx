import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Modal, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeOut, ZoomIn, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { PremiumCard } from '@/components/PremiumCard';
import { Button } from '@/components/Button';
import { TravelMap } from '@/components/TravelMap';

interface JournalEntry {
  id: string;
  time: string;
  type: 'pin' | 'coffee' | 'steps' | 'photo' | 'wallet' | 'mood';
  content: string;
  icon: string;
  color: string;
}

const initialEntries: JournalEntry[] = [
  { id: 'j1', time: '10:42 AM', type: 'pin', content: 'Visited the Eiffel Tower', icon: 'location-outline', color: '#0F62FE' },
  { id: 'j2', time: '12:15 PM', type: 'coffee', content: 'Had coffee near the Louvre', icon: 'cafe-outline', color: '#8B5CF6' },
  { id: 'j3', time: '04:30 PM', type: 'steps', content: 'Walked 12,300 steps today', icon: 'walk-outline', color: '#10B981' },
  { id: 'j4', time: '05:10 PM', type: 'photo', content: 'Captured 48 photos in Le Marais', icon: 'camera-outline', color: '#F59E0B' },
  { id: 'j5', time: '06:00 PM', type: 'wallet', content: 'Spent €52 today on dinner & snacks', icon: 'wallet-outline', color: '#EF4444' },
  { id: 'j6', time: '08:30 PM', type: 'mood', content: 'Mood: Excited', icon: 'happy-outline', color: '#EC4899' },
];

export default function JournalScreen() {
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [newEntryText, setNewEntryText] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');
  
  // Story Wrapped State
  const [isStoryVisible, setIsStoryVisible] = useState(false);
  const [storySlide, setStorySlide] = useState(0);

  const handleAddEntry = () => {
    if (!newEntryText.trim()) return;

    haptics.success();
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      type: 'pin',
      content: newEntryText.trim(),
      icon: 'chatbox-ellipses-outline',
      color: '#0F62FE',
    };

    setEntries((prev) => [newEntry, ...prev]);
    setNewEntryText('');
  };

  const handleMoodSelect = (mood: string, label: string) => {
    haptics.light();
    setSelectedMood(mood);
    const moodEntry: JournalEntry = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      type: 'mood',
      content: `Mood: ${label} ${mood}`,
      icon: 'happy-outline',
      color: '#EC4899',
    };
    setEntries((prev) => [moodEntry, ...prev]);
  };

  const handleShareStory = () => {
    haptics.heavy();
    alert('Sharing Trip Story image to social networks!');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Header bar */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Ionicons name="book-outline" size={18} color="#0F62FE" />
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>TRAVEL JOURNAL</Text>
          <Pressable onPress={() => { haptics.medium(); setIsStoryVisible(true); setStorySlide(0); }}>
            <View style={styles.wrappedBadge}>
              <Ionicons name="sparkles" size={12} color="#ffffff" />
              <Text style={styles.wrappedBadgeText}>Wrapped</Text>
            </View>
          </Pressable>
        </GlassView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Story wrapped trigger banner */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <PremiumCard onPress={() => { haptics.medium(); setIsStoryVisible(true); setStorySlide(0); }}>
            <LinearGradient
              colors={['#8E2DE2', '#4A00E0']}
              style={styles.wrappedGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.wrappedHeader}>
                <Ionicons name="sparkles" size={24} color="#ffffff" />
                <Text style={styles.wrappedTitle}>PARIS STORY WRAPPED</Text>
              </View>
              <Text style={styles.wrappedText}>
                Your trip is complete! Compile your footsteps, photos, mood logs, and milestones into an animated story cards template.
              </Text>
              <View style={styles.wrappedAction}>
                <Text style={styles.wrappedActionText}>Generate Trip Story</Text>
                <Ionicons name="arrow-forward-outline" size={14} color="#ffffff" />
              </View>
            </LinearGradient>
          </PremiumCard>
        </Animated.View>

        {/* Mood Tracker Widget */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)}>
          <GlassView style={styles.moodCard} borderRadius={28}>
            <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>How is your mood today?</Text>
            <View style={styles.moodRow}>
              <Pressable onPress={() => handleMoodSelect('😊', 'Excited')} style={styles.moodButton}>
                <Text style={styles.moodEmoji}>😊</Text>
                <Text style={[styles.moodLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Excited</Text>
              </Pressable>
              <Pressable onPress={() => handleMoodSelect('😌', 'Content')} style={styles.moodButton}>
                <Text style={styles.moodEmoji}>😌</Text>
                <Text style={[styles.moodLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Peaceful</Text>
              </Pressable>
              <Pressable onPress={() => handleMoodSelect('🥱', 'Tired')} style={styles.moodButton}>
                <Text style={styles.moodEmoji}>🥱</Text>
                <Text style={[styles.moodLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Exhausted</Text>
              </Pressable>
              <Pressable onPress={() => handleMoodSelect('🤪', 'Spontaneous')} style={styles.moodButton}>
                <Text style={styles.moodEmoji}>🤪</Text>
                <Text style={[styles.moodLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Playful</Text>
              </Pressable>
            </View>
          </GlassView>
        </Animated.View>

        {/* Add Entry Form */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <GlassView style={styles.addCard} borderRadius={24}>
            <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Log visited milestone</Text>
            <View style={styles.formRow}>
              <TextInput
                placeholder="Where did you go? (e.g. Cafe de Flore)"
                placeholderTextColor={isDark ? '#60646C' : '#90949C'}
                value={newEntryText}
                onChangeText={setNewEntryText}
                style={[styles.input, { color: isDark ? '#ffffff' : '#000000', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
              />
              <Pressable onPress={handleAddEntry} style={styles.addBtn}>
                <Ionicons name="add-circle" size={44} color="#0F62FE" />
              </Pressable>
            </View>
          </GlassView>
        </Animated.View>

        {/* Visited milestones timeline */}
        <View style={styles.timelineSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Travel Timeline</Text>
          <View style={styles.timelineList}>
            {entries.map((item, idx) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.duration(600).delay(250 + idx * 50)}
                layout={Layout.springify()}
                style={styles.timelineRow}
              >
                <View style={styles.bulletCol}>
                  <View style={[styles.bulletCircle, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={14} color="#ffffff" />
                  </View>
                  {idx < entries.length - 1 && <View style={[styles.connectingLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }]} />}
                </View>

                <View style={styles.textCol}>
                  <Text style={[styles.itemTime, { color: isDark ? '#60646C' : '#90949C' }]}>{item.time}</Text>
                  <Text style={[styles.itemContent, { color: isDark ? '#ffffff' : '#000000' }]}>{item.content}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* TRIP STORY WRAPPED MODAL OVERLAY */}
      <Modal visible={isStoryVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <GlassView style={styles.storyContainer} borderRadius={32}>
            {/* Story Indicator Bar */}
            <View style={styles.indicatorBar}>
              {[0, 1, 2, 3].map((num) => (
                <View
                  key={num}
                  style={[
                    styles.barSegment,
                    { backgroundColor: num <= storySlide ? '#ffffff' : 'rgba(255,255,255,0.25)' },
                  ]}
                />
              ))}
            </View>

            {/* Story Slide Pages Content */}
            <View style={styles.slideContent}>
              {storySlide === 0 && (
                <Animated.View entering={FadeIn.duration(500)} style={styles.slidePage}>
                  <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={StyleSheet.absoluteFill} />
                  <Text style={styles.slideEmoji}>🗼</Text>
                  <Text style={styles.slideHugeTitle}>My Paris Wrapped</Text>
                  <Text style={styles.slideSubtitle}>July 15 - July 22, 2026</Text>
                  <Text style={styles.slideQuote}>"Paris is always a good idea." — Audrey Hepburn</Text>
                </Animated.View>
              )}

              {storySlide === 1 && (
                <Animated.View entering={FadeIn.duration(500)} style={styles.slidePage}>
                  <LinearGradient colors={['#1F1C2C', '#928DAB']} style={StyleSheet.absoluteFill} />
                  <Text style={styles.slideHeadline}>YOUR ROUTE MAP</Text>
                  <View style={styles.wrappedMapWrapper}>
                    <TravelMap
                      height={200}
                      darkMode
                      zoom={12}
                      centerLat={48.8566}
                      centerLng={2.3522}
                      markers={[
                        { lat: 48.8584, lng: 2.2945, label: 'Eiffel Tower', color: '#10B981' },
                        { lat: 48.8606, lng: 2.3376, label: 'Louvre Museum', color: '#F59E0B' },
                        { lat: 48.8530, lng: 2.3499, label: 'Notre-Dame', color: '#8B5CF6' },
                        { lat: 48.8462, lng: 2.3965, label: 'Le Marais', color: '#EF4444' },
                      ]}
                    />
                  </View>
                  <Text style={styles.slideRouteDetails}>Paris milestones over 7 days</Text>
                </Animated.View>
              )}

              {storySlide === 2 && (
                <Animated.View entering={FadeIn.duration(500)} style={styles.slidePage}>
                  <LinearGradient colors={['#FF416C', '#FF4B2B']} style={StyleSheet.absoluteFill} />
                  <Text style={styles.slideHeadline}>STATISTICS SUMMARY</Text>
                  <View style={styles.statBox}>
                    <View style={styles.statItem}>
                      <Ionicons name="walk-outline" size={24} color="#ffffff" />
                      <Text style={styles.statValue}>12,300</Text>
                      <Text style={styles.statLabel}>Steps walked</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="camera-outline" size={24} color="#ffffff" />
                      <Text style={styles.statValue}>48</Text>
                      <Text style={styles.statLabel}>Photos taken</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="happy-outline" size={24} color="#ffffff" />
                      <Text style={styles.statValue}>Excited</Text>
                      <Text style={styles.statLabel}>Primary Mood</Text>
                    </View>
                  </View>
                </Animated.View>
              )}

              {storySlide === 3 && (
                <Animated.View entering={FadeIn.duration(500)} style={styles.slidePage}>
                  <LinearGradient colors={['#0F2027', '#2C5364']} style={StyleSheet.absoluteFill} />
                  <Text style={styles.slideHeadline}>SPENDING WRAPPED</Text>
                  <Text style={styles.spendTotal}>€982.00</Text>
                  <Text style={styles.spendDetails}>Total expenditure for Paris adventure</Text>
                  
                  <View style={styles.wrappedLegend}>
                    <Text style={styles.wrappedLegendText}>🛌 Lodging: €560 (57%)</Text>
                    <Text style={styles.wrappedLegendText}>✈️ Flights: €370 (37%)</Text>
                    <Text style={styles.wrappedLegendText}>🍽️ Dining: €52 (6%)</Text>
                  </View>

                  <Button title="Share to Socials 🚀" onPress={handleShareStory} style={styles.shareBtn} />
                </Animated.View>
              )}
            </View>

            {/* Tap areas to navigate slides */}
            <View style={styles.tapControlsRow}>
              <Pressable
                onPress={() => { haptics.light(); setStorySlide((prev) => Math.max(prev - 1, 0)); }}
                style={styles.tapSide}
              />
              <Pressable
                onPress={() => {
                  haptics.light();
                  if (storySlide === 3) {
                    setIsStoryVisible(false);
                  } else {
                    setStorySlide((prev) => prev + 1);
                  }
                }}
                style={styles.tapSide}
              />
            </View>

            {/* Top Close Button */}
            <Pressable onPress={() => setIsStoryVisible(false)} style={styles.closeStoryBtn}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </Pressable>
          </GlassView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  wrappedBadge: {
    backgroundColor: '#8E2DE2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  wrappedBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 130,
    gap: 24,
    width: '100%',
  },
  wrappedGradient: {
    borderRadius: 28,
    padding: 24,
    gap: 12,
  },
  wrappedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wrappedTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  wrappedText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  wrappedAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  wrappedActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  moodCard: {
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    gap: 6,
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  addCard: {
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineSection: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  timelineList: {
    gap: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 16,
  },
  bulletCol: {
    alignItems: 'center',
  },
  bulletCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  textCol: {
    flex: 1,
    paddingBottom: 16,
  },
  itemTime: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemContent: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },

  // Wrapped Modal Styles
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  storyContainer: {
    width: Platform.OS === 'web' ? 420 : '100%',
    maxWidth: 440,
    height: 600,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  indicatorBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 4,
    zIndex: 100,
  },
  barSegment: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
  },
  slideContent: {
    flex: 1,
  },
  slidePage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 36,
  },
  slideEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  slideHugeTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  slideSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  slideQuote: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 36,
    lineHeight: 18,
  },
  slideHeadline: {
    color: '#00C6FF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  wrappedMapWrapper: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    width: '100%',
    padding: 16,
    marginBottom: 16,
  },
  slideRouteDetails: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statBox: {
    gap: 20,
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    padding: 16,
    gap: 16,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  spendTotal: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
  },
  spendDetails: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 24,
  },
  wrappedLegend: {
    gap: 10,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  wrappedLegendText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  shareBtn: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 16,
  },
  tapControlsRow: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    zIndex: 50,
  },
  tapSide: {
    flex: 1,
    height: '100%',
  },
  closeStoryBtn: {
    position: 'absolute',
    top: 32,
    right: 16,
    zIndex: 110,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
