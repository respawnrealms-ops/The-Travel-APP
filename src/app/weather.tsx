import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { LinearGradient } from 'expo-linear-gradient';
import { weatherService } from '@/services/weather';

export default function WeatherScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const destination = 'Paris';
  const weather = weatherService.getWeather(destination);
  const current = weather.current;

  const getIconName = (icon: string) => {
    switch (icon) {
      case 'sunny': return 'sunny-outline';
      case 'partly-sunny': return 'cloudy-night-outline';
      case 'rainy': return 'rainy-outline';
      case 'cloudy': return 'cloudy-outline';
      default: return 'partly-sunny-outline';
    }
  };

  const getWeatherTip = (cond: string) => {
    const term = cond.toLowerCase();
    if (term.includes('sunny') || term.includes('pleasant')) {
      return '☀️ Perfect day for a walk in the Jardin du Luxembourg! Don\'t forget sunscreen and sunglasses.';
    }
    if (term.includes('rain') || term.includes('shower')) {
      return '🌧️ Rain expected. Great time to explore indoor gems like the Louvre Museum or the Orsay Museum!';
    }
    return '🌥️ Overcast skies. Ideal weather for shopping in the Marais district or grabbing hot cocoa at Café de Flore.';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Pressable onPress={() => { haptics.selection(); router.back(); }} style={styles.backButton}>
            <Ionicons name="close" size={22} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>PARIS CLIMATE</Text>
          <Ionicons name="partly-sunny" size={18} color="#00C6FF" />
        </GlassView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Temperature Display */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.heroSection}>
          <Text style={[styles.tempMain, { color: isDark ? '#ffffff' : '#0F62FE' }]}>{current.temp}°</Text>
          <Text style={[styles.conditionText, { color: isDark ? '#ffffff' : '#000000' }]}>{current.condition}</Text>
          <View style={styles.tempRangeRow}>
            <Text style={[styles.rangeText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>H: 25°  L: 14°</Text>
          </View>
        </Animated.View>

        {/* Dynamic Recommendation Banner */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)}>
          <GlassView style={styles.recommendationCard} borderRadius={24}>
            <View style={styles.tipHeader}>
              <Ionicons name="compass-outline" size={18} color="#0F62FE" />
              <Text style={styles.tipTitle}>TRAVEL ADVISORY</Text>
            </View>
            <Text style={styles.tipText}>
              {getWeatherTip(current.condition)}
            </Text>
          </GlassView>
        </Animated.View>

        {/* 24-Hour Forecast Slider */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>24-Hour Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyScroll}>
            {weather.hourly.map((h, idx) => (
              <GlassView key={idx} style={styles.hourlyCard} borderRadius={18}>
                <Text style={[styles.hourTime, { color: isDark ? '#B0B4BA' : '#60646C' }]}>{h.time}</Text>
                <Ionicons name={getIconName(h.icon) as any} size={22} color="#00C6FF" style={styles.hourIcon} />
                <Text style={[styles.hourTemp, { color: isDark ? '#ffffff' : '#000000' }]}>{h.temp}°</Text>
              </GlassView>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Detailed Stats Grid */}
        <Animated.View entering={FadeInDown.duration(800).delay(300)} style={styles.gridSection}>
          <View style={styles.gridRow}>
            <GlassView style={styles.gridCell} borderRadius={20}>
              <Ionicons name="sunny-outline" size={18} color="#F59E0B" />
              <Text style={styles.cellLabel}>UV Index</Text>
              <Text style={[styles.cellValue, { color: isDark ? '#ffffff' : '#000000' }]}>{current.uvIndex} Moderate</Text>
            </GlassView>

            <GlassView style={styles.gridCell} borderRadius={20}>
              <Ionicons name="leaf-outline" size={18} color="#10B981" />
              <Text style={styles.cellLabel}>Air Quality</Text>
              <Text style={[styles.cellValue, { color: isDark ? '#ffffff' : '#000000' }]}>{current.aqi} Excellent</Text>
            </GlassView>
          </View>

          <View style={styles.gridRow}>
            <GlassView style={styles.gridCell} borderRadius={20}>
              <Ionicons name="water-outline" size={18} color="#0F62FE" />
              <Text style={styles.cellLabel}>Humidity</Text>
              <Text style={[styles.cellValue, { color: isDark ? '#ffffff' : '#000000' }]}>{current.humidity}%</Text>
            </GlassView>

            <GlassView style={styles.gridCell} borderRadius={20}>
              <Ionicons name="speedometer-outline" size={18} color="#8B5CF6" />
              <Text style={styles.cellLabel}>Wind Speed</Text>
              <Text style={[styles.cellValue, { color: isDark ? '#ffffff' : '#000000' }]}>{current.windSpeed} km/h</Text>
            </GlassView>
          </View>
        </Animated.View>

        {/* 10-Day Forecast List */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>10-Day Forecast</Text>
          <GlassView style={styles.forecastCard} borderRadius={28}>
            {weather.daily.map((day, idx) => (
              <View key={idx}>
                <View style={styles.forecastRow}>
                  <Text style={[styles.dayText, { color: isDark ? '#ffffff' : '#000000' }]}>{day.day}</Text>
                  <Ionicons name={getIconName(day.icon) as any} size={20} color="#00C6FF" />
                  <Text style={[styles.dayCondition, { color: isDark ? '#B0B4BA' : '#60646C' }]}>{day.condition}</Text>
                  <View style={styles.dayTempRange}>
                    <Text style={[styles.minTemp, { color: isDark ? '#60646C' : '#90949C' }]}>{day.tempMin}°</Text>
                    <View style={styles.tempBarBg}>
                      <LinearGradient
                        colors={['#00C6FF', '#0F62FE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.tempBarFill}
                      />
                    </View>
                    <Text style={[styles.maxTemp, { color: isDark ? '#ffffff' : '#000000' }]}>{day.tempMax}°</Text>
                  </View>
                </View>
                {idx < weather.daily.length - 1 && <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />}
              </View>
            ))}
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  tempMain: {
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -1,
  },
  conditionText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: -4,
  },
  tempRangeRow: {
    marginTop: 4,
  },
  rangeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendationCard: {
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 98, 254, 0.15)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipTitle: {
    fontSize: 11,
    color: '#0F62FE',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#E0E1E6',
  },
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginLeft: 4,
  },
  hourlyScroll: {
    gap: 8,
    height: 104,
  },
  hourlyCard: {
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  hourTime: {
    fontSize: 11,
    fontWeight: '700',
  },
  hourIcon: {
    marginVertical: 6,
  },
  hourTemp: {
    fontSize: 14,
    fontWeight: '700',
  },
  gridSection: {
    gap: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gridCell: {
    flex: 1,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cellLabel: {
    fontSize: 10,
    color: '#60646C',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cellValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  forecastCard: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    justifyContent: 'space-between',
  },
  dayText: {
    width: 80,
    fontSize: 14,
    fontWeight: '700',
  },
  dayCondition: {
    width: 90,
    fontSize: 12,
    fontWeight: '600',
  },
  dayTempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  minTemp: {
    fontSize: 13,
    fontWeight: '700',
    width: 24,
    textAlign: 'right',
  },
  maxTemp: {
    fontSize: 13,
    fontWeight: '700',
    width: 24,
    textAlign: 'left',
  },
  tempBarBg: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  tempBarFill: {
    height: '100%',
    width: '70%',
    borderRadius: 2,
  },
  divider: {
    height: 1,
  },
});
