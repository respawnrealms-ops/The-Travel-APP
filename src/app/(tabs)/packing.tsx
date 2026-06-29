import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Platform, useColorScheme, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaptics } from '@/hooks/useHaptics';
import { GlassView } from '@/components/GlassView';
import { PremiumCard } from '@/components/PremiumCard';
import { Button } from '@/components/Button';
import { weatherService } from '@/services/weather';

interface PackingItem {
  id: string;
  name: string;
  category: 'Clothing' | 'Tech' | 'Toiletries' | 'Documents';
  packed: boolean;
  weight: number; // in kg
}

const initialItems: PackingItem[] = [
  { id: '1', name: 'Passport & Visa', category: 'Documents', packed: true, weight: 0.1 },
  { id: '2', name: 'Universal Adapter', category: 'Tech', packed: false, weight: 0.2 },
  { id: '3', name: 'Merino Wool Shirts', category: 'Clothing', packed: false, weight: 0.6 },
  { id: '4', name: 'Noise-Cancelling Headphones', category: 'Tech', packed: true, weight: 0.3 },
  { id: '5', name: 'Toothbrush & Paste', category: 'Toiletries', packed: false, weight: 0.15 },
  { id: '6', name: 'Rain jacket', category: 'Clothing', packed: false, weight: 0.4 },
];

export default function PackingScreen() {
  const haptics = useHaptics();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<PackingItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'Clothing' | 'Tech' | 'Toiletries' | 'Documents'>('Clothing');
  const [newItemWeight, setNewItemWeight] = useState('0.2');

  const [weatherAlert, setWeatherAlert] = useState<string | null>(null);

  useEffect(() => {
    // Check weather at next destination (Paris) and trigger recommendation
    const weather = weatherService.getWeather('Paris').current;
    if (weather.condition.toLowerCase().includes('cloudy') || weather.condition.toLowerCase().includes('rain')) {
      setWeatherAlert('Rain is forecast in Paris. Ensure your rain jacket and umbrella are packed!');
    }
  }, []);

  const handleToggle = (id: string) => {
    haptics.light();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    // Duplicate detection
    const isDuplicate = items.some(
      (item) => item.name.toLowerCase().trim() === newItemName.toLowerCase().trim()
    );

    if (isDuplicate) {
      haptics.warning();
      alert('This item is already on your packing list!');
      return;
    }

    haptics.success();
    const newItem: PackingItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      category: newItemCategory,
      packed: false,
      weight: parseFloat(newItemWeight) || 0.1,
    };

    setItems((prev) => [newItem, ...prev]);
    setNewItemName('');
  };

  const handleDelete = (id: string) => {
    haptics.medium();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const packingPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;
  const totalWeight = items.reduce((acc, item) => acc + (item.packed ? item.weight : 0), 0);

  const categories: ('Clothing' | 'Tech' | 'Toiletries' | 'Documents')[] = [
    'Documents',
    'Clothing',
    'Tech',
    'Toiletries',
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#050B14' : '#F4F9FF' }]}>
      {/* Header bar */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 8 }]}>
        <GlassView style={styles.headerBlur} borderRadius={24}>
          <Ionicons name="briefcase-outline" size={18} color="#0F62FE" />
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>PACKING LIST</Text>
          <Text style={[styles.headerWeight, { color: '#0F62FE' }]}>{totalWeight.toFixed(2)} kg</Text>
        </GlassView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <Animated.View entering={FadeInDown.duration(800)}>
          <PremiumCard style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View style={styles.progressTextCol}>
                <Text style={styles.progressTitle}>Packing Progress</Text>
                <Text style={styles.progressDetails}>
                  {packedCount} of {totalCount} items loaded
                </Text>
                <Text style={styles.weightEstimation}>
                  Estimated Bag Weight: <Text style={styles.weightHighlight}>{totalWeight.toFixed(2)} / 15.0 kg</Text>
                </Text>
              </View>

              {/* Simulated Progress Ring */}
              <View style={styles.progressCircle}>
                <Text style={styles.circleText}>{packingPercent}%</Text>
              </View>
            </View>
          </PremiumCard>
        </Animated.View>

        {/* Weather-aware Alert Banner */}
        {weatherAlert && (
          <Animated.View entering={FadeInDown.duration(800).delay(100)}>
            <GlassView style={styles.alertBanner} borderRadius={20}>
              <Ionicons name="rainy-outline" size={20} color="#00C6FF" />
              <Text style={styles.alertText}>{weatherAlert}</Text>
            </GlassView>
          </Animated.View>
        )}

        {/* Add Item form */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <GlassView style={styles.addCard} borderRadius={24}>
            <Text style={[styles.addCardTitle, { color: isDark ? '#ffffff' : '#0F62FE' }]}>Add Custom Item</Text>
            <View style={styles.formRow}>
              <TextInput
                placeholder="Item name (e.g. Passport)"
                placeholderTextColor={isDark ? '#60646C' : '#90949C'}
                value={newItemName}
                onChangeText={setNewItemName}
                style={[styles.input, { color: isDark ? '#ffffff' : '#000000', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
              />
              <TextInput
                placeholder="0.2"
                placeholderTextColor={isDark ? '#60646C' : '#90949C'}
                value={newItemWeight}
                onChangeText={setNewItemWeight}
                keyboardType="numeric"
                style={[styles.weightInput, { color: isDark ? '#ffffff' : '#000000', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
              />
              <Text style={[styles.kgText, { color: isDark ? '#B0B4BA' : '#60646C' }]}>kg</Text>
            </View>

            {/* Category Select Slider */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
              {categories.map((cat) => {
                const isSelected = newItemCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => { haptics.light(); setNewItemCategory(cat); }}
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
            </ScrollView>

            <Button title="Add to List" onPress={handleAddItem} style={styles.addBtn} />
          </GlassView>
        </Animated.View>

        {/* Categories checklist */}
        <View style={styles.checklistSection}>
          {categories.map((cat, catIdx) => {
            const catItems = items.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;

            return (
              <Animated.View
                key={cat}
                entering={FadeInDown.duration(600).delay(300 + catIdx * 100)}
                style={styles.categoryBlock}
              >
                <Text style={[styles.categoryTitle, { color: isDark ? '#B0B4BA' : '#60646C' }]}>{cat}</Text>
                <View style={styles.itemsGrid}>
                  {catItems.map((item) => (
                    <Animated.View
                      key={item.id}
                      layout={Layout.springify()}
                      style={[
                        styles.itemRow,
                        { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.015)' },
                      ]}
                    >
                      <Pressable onPress={() => handleToggle(item.id)} style={styles.itemTrigger}>
                        <View
                          style={[
                            styles.checkbox,
                            item.packed && styles.checkboxActive,
                            { borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' },
                          ]}
                        >
                          {item.packed && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                        </View>
                        <Text
                          style={[
                            styles.itemName,
                            item.packed && styles.itemNamePacked,
                            { color: isDark ? '#ffffff' : '#000000' },
                          ]}
                        >
                          {item.name}
                        </Text>
                      </Pressable>

                      <View style={styles.rowRight}>
                        <Text style={[styles.itemWeight, { color: isDark ? '#60646C' : '#90949C' }]}>
                          {item.weight} kg
                        </Text>
                        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </Pressable>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            );
          })}
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
    paddingTop: 20,
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
  headerWeight: {
    fontSize: 13,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 130,
    width: '100%',
  },
  progressCard: {
    padding: 24,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTextCol: {
    flex: 1,
    gap: 4,
  },
  progressTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  progressDetails: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  weightEstimation: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  weightHighlight: {
    color: '#00C6FF',
    fontWeight: '700',
  },
  progressCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(15, 98, 254, 0.15)',
    borderWidth: 3,
    borderColor: '#0F62FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 198, 255, 0.2)',
  },
  alertText: {
    color: '#00C6FF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    flex: 1,
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
  weightInput: {
    width: 60,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  kgText: {
    fontSize: 13,
    fontWeight: '600',
  },
  catScroll: {
    gap: 8,
    height: 38,
  },
  catChip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    justifyContent: 'center',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  addBtn: {
    height: 48,
    borderRadius: 16,
    marginTop: 4,
  },
  checklistSection: {
    gap: 20,
  },
  categoryBlock: {
    gap: 10,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  itemsGrid: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0F62FE',
    borderColor: '#0F62FE',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemNamePacked: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemWeight: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
