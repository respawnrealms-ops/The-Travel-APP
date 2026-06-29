import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Pressable, Text, Platform, useColorScheme, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHaptics } from '@/hooks/useHaptics';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const themeColors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} themeColors={themeColors} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="ai-planner"
        options={{
          title: 'Planner',
        }}
      />
      <Tabs.Screen
        name="packing"
        options={{
          title: 'Pack',
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Spend',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation, themeColors }: any) {
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;
  const { width } = useWindowDimensions();

  const barWidth = Math.max(Math.min(width - 24, 360), 220);
  const isCompact = barWidth < 300;
  const tabWidth = barWidth / 5;
  const slideX = useSharedValue(activeIndex * tabWidth);

  React.useEffect(() => {
    slideX.value = withSpring(activeIndex * tabWidth, {
      damping: 15,
      stiffness: 150,
    });
  }, [activeIndex, slideX, tabWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value }],
    };
  });

  const getIcon = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case 'index':
        return focused ? 'home' : 'home-outline';
      case 'ai-planner':
        return focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
      case 'packing':
        return focused ? 'briefcase' : 'briefcase-outline';
      case 'expenses':
        return focused ? 'wallet' : 'wallet-outline';
      case 'journal':
        return focused ? 'book' : 'book-outline';
      default:
        return 'ellipse';
    }
  };

  const isDark = themeColors.text === '#ffffff';
  const bottomOffset = insets.bottom > 0 ? insets.bottom + 8 : 20;

  return (
    <View style={[styles.outerContainer, { bottom: bottomOffset }]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.blurContainer,
          {
            width: barWidth,
            height: isCompact ? 58 : 64,
            borderRadius: isCompact ? 29 : 32,
          },
          Platform.OS === 'web' && ({
            backgroundColor: isDark ? 'rgba(33, 34, 37, 0.82)' : 'rgba(240, 240, 243, 0.88)',
            backdropFilter: 'blur(24px)',
          } as any),
          Platform.OS === 'android' && ({
            backgroundColor: isDark ? 'rgba(10, 18, 32, 0.96)' : 'rgba(244, 249, 255, 0.97)',
          } as any),
        ]}
      >
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: Math.max(tabWidth - 12, 34),
              height: isCompact ? 46 : 52,
              borderRadius: isCompact ? 23 : 26,
            },
            animatedIndicatorStyle,
          ]}
        />
        <View style={styles.tabsRow}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.title ?? route.name;
            const isFocused = activeIndex === index;

            const onPress = () => {
              haptics.light();
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate({ name: route.name, merge: true });
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.tabButton}
              >
                <Ionicons
                  name={getIcon(route.name, isFocused)}
                  size={22}
                  color={isFocused ? '#0F62FE' : isDark ? '#B0B4BA' : '#60646C'}
                />
                <Text
                  style={[
                  styles.label,
                  isCompact && styles.labelCompact,
                  {
                    color: isFocused ? '#0F62FE' : isDark ? '#B0B4BA' : '#60646C',
                    fontWeight: isFocused ? '600' : '400',
                    },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  blurContainer: {
    width: 320,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 2,
  },
  activeIndicator: {
    position: 'absolute',
    left: 6,
    height: 52,
    backgroundColor: 'rgba(15, 98, 254, 0.12)',
    borderRadius: 26,
    zIndex: 1,
  },
  label: {
    fontSize: 10,
    marginTop: 1,
  },
  labelCompact: {
    fontSize: 9,
  },
});
