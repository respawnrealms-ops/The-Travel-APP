import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Dimensions, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { currencyService, SUPPORTED_CURRENCIES } from '@/services/currency';

export default function CurrencyScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [fromCode, setFromCode] = useState('EUR');
  const [toCode, setToCode] = useState('USD');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState(1.09);

  // Rotation value for swap button
  const swapRotation = useSharedValue(0);

  useEffect(() => {
    const amt = parseFloat(amount) || 0;
    const res = currencyService.convert(amt, fromCode, toCode);
    setConvertedAmount(Number(res.toFixed(2)));
  }, [amount, fromCode, toCode]);

  const handleNumpadPress = (val: string) => {
    haptics.light();
    if (val === 'C') {
      setAmount('0');
      return;
    }
    if (val === '.') {
      if (amount.includes('.')) return;
      setAmount((prev) => prev + '.');
      return;
    }
    setAmount((prev) => {
      if (prev === '0') return val;
      return prev + val;
    });
  };

  const handleBackspace = () => {
    haptics.light();
    setAmount((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleSwap = () => {
    haptics.medium();
    swapRotation.value = withSpring(swapRotation.value + 180);
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const animatedSwapStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${swapRotation.value}deg` }],
    };
  });

  const rateHistory = currencyService.getHistory(fromCode, toCode);
  const currentRate = currencyService.convert(1, fromCode, toCode);

  // Render SVG Line Chart Coordinates
  const chartHeight = 80;
  const chartWidth = 320;
  const rates = rateHistory.map(h => h.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const rateRange = maxRate - minRate || 1;

  const points = rateHistory.map((h, i) => {
    const x = (i / rateHistory.length) * chartWidth;
    const y = chartHeight - ((h.rate - minRate) / rateRange) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M ${points}`;

  const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Pressable onPress={() => { haptics.selection(); router.back(); }} style={styles.backButton}>
            <Ionicons name="close" size={22} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>EXCHANGE RATES</Text>
          <Ionicons name="stats-chart-outline" size={18} color="#0F62FE" />
        </GlassView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Swappable Conversion grid */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <GlassView style={styles.converterCard} borderRadius={28}>
            <View style={styles.row}>
              <View style={styles.currencyBlock}>
                <Text style={[styles.currencyLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>From</Text>
                <Text style={[styles.currencyCode, { color: isDark ? '#ffffff' : '#000000' }]}>{fromCode}</Text>
                <Text style={[styles.currencyValue, { color: '#0F62FE' }]}>{amount}</Text>
              </View>

              <Pressable onPress={handleSwap} style={styles.swapBtnWrapper}>
                <Animated.View style={[styles.swapBtn, animatedSwapStyle]}>
                  <Ionicons name="swap-horizontal" size={20} color="#ffffff" />
                </Animated.View>
              </Pressable>

              <View style={styles.currencyBlock}>
                <Text style={[styles.currencyLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>To</Text>
                <Text style={[styles.currencyCode, { color: isDark ? '#ffffff' : '#000000' }]}>{toCode}</Text>
                <Text style={[styles.currencyValue, { color: isDark ? '#ffffff' : '#000000' }]}>{convertedAmount}</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]} />
            <Text style={[styles.rateInfo, { color: isDark ? '#60646C' : '#90949C' }]}>
              Live Mid-Market Rate: 1 {fromCode} = {currentRate.toFixed(4)} {toCode}
            </Text>
          </GlassView>
        </Animated.View>

        {/* Exchange trend SVG Chart */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)}>
          <GlassView style={styles.chartCard} borderRadius={28}>
            <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>30-Day Trend</Text>
            <View style={styles.chartWrapper}>
              <Svg height={chartHeight} width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                <Path
                  d={pathD}
                  fill="none"
                  stroke="#00C6FF"
                  strokeWidth="2.5"
                />
                {/* Endpoint circle */}
                <Circle cx={chartWidth} cy={chartHeight - ((rates[rates.length - 1] - minRate) / rateRange) * (chartHeight - 20) - 10} r="4" fill="#0F62FE" />
              </Svg>
            </View>
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabelText}>{rateHistory[0].date}</Text>
              <Text style={styles.chartLabelText}>{rateHistory[rateHistory.length - 1].date}</Text>
            </View>
          </GlassView>
        </Animated.View>

        {/* Calculator Numpad */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <GlassView style={styles.numpadCard} borderRadius={28}>
            <View style={styles.numpadGrid}>
              {numpadKeys.map((key) => (
                <Pressable
                  key={key}
                  onPress={() => handleNumpadPress(key)}
                  style={[styles.numpadBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
                >
                  <Text style={[styles.numpadBtnText, { color: isDark ? '#ffffff' : '#000000' }]}>{key}</Text>
                </Pressable>
              ))}
              <Pressable
                onPress={handleBackspace}
                style={[styles.numpadBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}
              >
                <Ionicons name="backspace-outline" size={20} color={isDark ? '#ffffff' : '#000000'} />
              </Pressable>
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
    gap: 20,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
  },
  converterCard: {
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currencyBlock: {
    flex: 1,
    gap: 4,
  },
  currencyLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  currencyCode: {
    fontSize: 22,
    fontWeight: '800',
  },
  currencyValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  swapBtnWrapper: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F62FE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F62FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  divider: {
    height: 1,
  },
  rateInfo: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  chartCard: {
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chartWrapper: {
    paddingTop: 10,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  chartLabelText: {
    fontSize: 11,
    color: '#60646C',
    fontWeight: '700',
  },
  numpadCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  numpadBtn: {
    width: '31%',
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  numpadBtnText: {
    fontSize: 18,
    fontWeight: '800',
  },
});
