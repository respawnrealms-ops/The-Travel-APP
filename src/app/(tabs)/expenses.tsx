import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Platform, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { PremiumCard } from '@/components/PremiumCard';
import { Button } from '@/components/Button';

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'Flights' | 'Lodging' | 'Dining' | 'Activities';
  date: string;
}

const initialExpenses: ExpenseItem[] = [
  { id: '1', title: 'Hotel Regina Louvre', amount: 560, category: 'Lodging', date: 'Jul 16' },
  { id: '2', title: 'Air France Flight', amount: 370, category: 'Flights', date: 'Jul 15' },
  { id: '3', title: 'Dinner at Le Comptoir', amount: 52, category: 'Dining', date: 'Jul 15' },
  { id: '4', title: 'Louvre Tickets', amount: 44, category: 'Activities', date: 'Jul 16' },
];

export default function ExpensesScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<'Flights' | 'Lodging' | 'Dining' | 'Activities'>('Dining');

  // Split Calculator State
  const [splitAmount, setSplitAmount] = useState('120');
  const [splitPeople, setSplitPeople] = useState('3');
  const [splitResult, setSplitResult] = useState<number | null>(40);

  const budgetLimit = 1500;
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const budgetPercent = Math.min((totalSpent / budgetLimit) * 100, 100);

  const categoryColors = {
    Lodging: '#10B981',
    Flights: '#0F62FE',
    Dining: '#EF4444',
    Activities: '#F59E0B',
  };

  const handleAddExpense = () => {
    if (!newTitle.trim() || !newAmount.trim()) return;

    haptics.success();
    const expense: ExpenseItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      amount: parseFloat(newAmount) || 0,
      category: newCategory,
      date: 'Today',
    };

    setExpenses((prev) => [expense, ...prev]);
    setNewTitle('');
    setNewAmount('');
  };

  const handleSplitCalculate = () => {
    haptics.medium();
    const amt = parseFloat(splitAmount) || 0;
    const ppl = parseInt(splitPeople) || 1;
    setSplitResult(amt / ppl);
  };

  // Pie chart calculation coordinates
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const lodgingPct = (categoryTotals['Lodging'] || 0) / totalSpent;
  const flightsPct = (categoryTotals['Flights'] || 0) / totalSpent;
  const diningPct = (categoryTotals['Dining'] || 0) / totalSpent;
  const activitiesPct = (categoryTotals['Activities'] || 0) / totalSpent;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Top Header */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Ionicons name="wallet-outline" size={18} color="#0F62FE" />
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>EXPENSE ANALYZER</Text>
          <Text style={[styles.headerSpend, { color: '#EF4444' }]}>€{totalSpent}</Text>
        </GlassView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Budget Progress Indicator */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <PremiumCard style={styles.budgetCard}>
            <Text style={styles.budgetTitle}>Total Spent</Text>
            <View style={styles.budgetRow}>
              <Text style={styles.spentAmount}>€{totalSpent}</Text>
              <Text style={styles.limitText}>of €{budgetLimit} budget</Text>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <View style={[styles.progressBarFill, { width: `${budgetPercent}%`, backgroundColor: '#0F62FE' }]} />
            </View>
            <Text style={styles.budgetWarning}>
              {budgetPercent > 80 ? '⚠️ Budget warning! Near capacity.' : '👍 Spending is within target goals.'}
            </Text>
          </PremiumCard>
        </Animated.View>

        {/* Custom SVG Pie Chart */}
        <Animated.View entering={FadeInDown.duration(800).delay(100)}>
          <GlassView style={styles.chartCard} borderRadius={28}>
            <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Category Shares</Text>
            <View style={styles.pieRow}>
              <View style={styles.svgWrapper}>
                <Svg height="140" width="140" viewBox="0 0 120 120">
                  {/* Lodging slice */}
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={categoryColors.Lodging}
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={0}
                    transform="rotate(-90 60 60)"
                  />
                  {/* Flights slice */}
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={categoryColors.Flights}
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - lodgingPct)}
                    transform={`rotate(${-90 + lodgingPct * 360} 60 60)`}
                  />
                  {/* Dining slice */}
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={categoryColors.Dining}
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - diningPct)}
                    transform={`rotate(${-90 + (lodgingPct + flightsPct) * 360} 60 60)`}
                  />
                  {/* Activities slice */}
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={categoryColors.Activities}
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - activitiesPct)}
                    transform={`rotate(${-90 + (lodgingPct + flightsPct + diningPct) * 360} 60 60)`}
                  />
                </Svg>
              </View>

              <View style={styles.legendCol}>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: categoryColors.Lodging }]} />
                  <Text style={[styles.legendText, { color: isDark ? '#ffffff' : '#333' }]}>Lodging ({Math.round(lodgingPct * 100) || 0}%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: categoryColors.Flights }]} />
                  <Text style={[styles.legendText, { color: isDark ? '#ffffff' : '#333' }]}>Flights ({Math.round(flightsPct * 100) || 0}%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: categoryColors.Dining }]} />
                  <Text style={[styles.legendText, { color: isDark ? '#ffffff' : '#333' }]}>Dining ({Math.round(diningPct * 100) || 0}%)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: categoryColors.Activities }]} />
                  <Text style={[styles.legendText, { color: isDark ? '#ffffff' : '#333' }]}>Activities ({Math.round(activitiesPct * 100) || 0}%)</Text>
                </View>
              </View>
            </View>
          </GlassView>
        </Animated.View>

        {/* Currency conversion promo */}
        <Animated.View entering={FadeInDown.duration(800).delay(150)}>
          <GlassView style={styles.currencyPromo} borderRadius={24}>
            <View style={styles.promoHeader}>
              <Ionicons name="swap-horizontal-outline" size={20} color="#0F62FE" />
              <Text style={[styles.promoTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Need Live Conversions?</Text>
            </View>
            <Text style={[styles.promoText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>
              Instantly convert between EUR, USD, and JPY offline.
            </Text>
            <Button
              title="Open Currency Converter"
              onPress={() => router.push('/currency')}
              variant="glass"
              style={styles.promoBtn}
            />
          </GlassView>
        </Animated.View>

        {/* Add Expense Form */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <GlassView style={styles.addCard} borderRadius={24}>
            <Text style={[styles.addCardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Log Expense</Text>
            <View style={styles.formRow}>
              <TextInput
                placeholder="Title (e.g. Lunch)"
                placeholderTextColor={isDark ? '#60646C' : '#90949C'}
                value={newTitle}
                onChangeText={setNewTitle}
                style={[styles.input, { color: isDark ? '#ffffff' : '#000000', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
              />
              <TextInput
                placeholder="0.00"
                placeholderTextColor={isDark ? '#60646C' : '#90949C'}
                value={newAmount}
                onChangeText={setNewAmount}
                keyboardType="numeric"
                style={[styles.amountInput, { color: isDark ? '#ffffff' : '#000000', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
              />
              <Text style={[styles.euroText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>€</Text>
            </View>

            {/* Category selection */}
            <View style={styles.categoryRow}>
              {(['Flights', 'Lodging', 'Dining', 'Activities'] as const).map((cat) => {
                const isSelected = newCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => { haptics.light(); setNewCategory(cat); }}
                    style={[
                      styles.catChip,
                      { backgroundColor: isSelected ? '#0F62FE' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
                    ]}
                  >
                    <Text style={[styles.catChipText, { color: isSelected ? '#ffffff' : isDark ? '#B0B4BA' : '#60646C' }]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Button title="Save Expense" onPress={handleAddExpense} style={styles.saveBtn} />
          </GlassView>
        </Animated.View>

        {/* Split Calculator */}
        <Animated.View entering={FadeInDown.duration(800).delay(250)}>
          <GlassView style={styles.splitCard} borderRadius={24}>
            <Text style={[styles.addCardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Split Expense</Text>
            <View style={styles.splitInputRow}>
              <View style={styles.splitInputWrapper}>
                <Text style={[styles.inputLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Total Cost</Text>
                <TextInput
                  value={splitAmount}
                  onChangeText={setSplitAmount}
                  keyboardType="numeric"
                  style={[styles.splitInput, { color: isDark ? '#ffffff' : '#000000', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                />
              </View>

              <View style={styles.splitInputWrapper}>
                <Text style={[styles.inputLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>People</Text>
                <TextInput
                  value={splitPeople}
                  onChangeText={setSplitPeople}
                  keyboardType="numeric"
                  style={[styles.splitInput, { color: isDark ? '#ffffff' : '#000000', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                />
              </View>
            </View>
            <Button title="Calculate Split" onPress={handleSplitCalculate} variant="secondary" style={styles.calcBtn} />

            {splitResult !== null && (
              <View style={[styles.splitResultCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15, 98, 254, 0.05)' }]}>
                <Text style={[styles.resultLabel, { color: isDark ? '#B0B4BA' : '#60646C' }]}>Each Person Pays</Text>
                <Text style={[styles.resultValue, { color: '#0F62FE' }]}>€{splitResult.toFixed(2)}</Text>
              </View>
            )}
          </GlassView>
        </Animated.View>

        {/* Recent Ledger List */}
        <View style={styles.ledgerSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Recent Expenses</Text>
          <View style={styles.ledgerGrid}>
            {expenses.map((item) => (
              <Animated.View
                key={item.id}
                layout={Layout.springify()}
                style={[
                  styles.ledgerRow,
                  { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.015)' },
                ]}
              >
                <View style={styles.ledgerLeft}>
                  <View style={[styles.categoryCircle, { backgroundColor: categoryColors[item.category] }]}>
                    <Ionicons
                      name={
                        item.category === 'Flights'
                          ? 'airplane-outline'
                          : item.category === 'Lodging'
                          ? 'bed-outline'
                          : item.category === 'Dining'
                          ? 'restaurant-outline'
                          : 'camera-outline'
                      }
                      size={16}
                      color="#ffffff"
                    />
                  </View>
                  <View>
                    <Text style={[styles.ledgerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>{item.title}</Text>
                    <Text style={[styles.ledgerDate, { color: isDark ? '#60646C' : '#90949C' }]}>{item.date} • {item.category}</Text>
                  </View>
                </View>
                <Text style={[styles.ledgerAmount, { color: isDark ? '#ffffff' : '#000000' }]}>-€{item.amount}</Text>
              </Animated.View>
            ))}
          </View>
        </View>
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
  headerTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  headerSpend: {
    fontSize: 14,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 130,
    width: '100%',
  },
  budgetCard: {
    padding: 24,
    backgroundColor: '#050B14',
    gap: 12,
  },
  budgetTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  spentAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
  },
  limitText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  budgetWarning: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
  },
  chartCard: {
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
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendCol: {
    flex: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  currencyPromo: {
    padding: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(15,98,254,0.15)',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  promoText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  promoBtn: {
    height: 44,
    borderRadius: 14,
    marginTop: 4,
  },
  addCard: {
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  addCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  amountInput: {
    width: 80,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  euroText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  catChip: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  saveBtn: {
    height: 48,
    borderRadius: 16,
    marginTop: 4,
  },
  splitCard: {
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  splitInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  splitInputWrapper: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  splitInput: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  calcBtn: {
    height: 48,
    borderRadius: 16,
  },
  splitResultCard: {
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    gap: 4,
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  ledgerSection: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  ledgerGrid: {
    gap: 8,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  ledgerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ledgerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  ledgerDate: {
    fontSize: 11,
    fontWeight: '600',
  },
  ledgerAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
});
