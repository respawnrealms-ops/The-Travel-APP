import React from 'react';
import { StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GlassView } from './GlassView';
import { useHaptics } from '@/hooks/useHaptics';

interface PremiumCardProps {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
  glassIntensity?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PremiumCard({
  children,
  onPress,
  style,
  borderRadius = 28,
  glassIntensity = 30,
}: PremiumCardProps) {
  const haptics = useHaptics();
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.12);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 180 });
    shadowOpacity.value = withSpring(0.06);
    if (onPress) haptics.light();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 180 });
    shadowOpacity.value = withSpring(0.12);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      shadowOpacity: shadowOpacity.value,
    };
  });

  const cardStyle = [
    styles.card,
    { borderRadius },
    style,
  ];

  if (!onPress) {
    return (
      <GlassView borderRadius={borderRadius} intensity={glassIntensity} style={style}>
        {children}
      </GlassView>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, cardStyle]}
    >
      <GlassView borderRadius={borderRadius} intensity={glassIntensity} style={styles.glassContainer}>
        {children}
      </GlassView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 4,
    backgroundColor: 'transparent',
  },
  glassContainer: {
    width: '100%',
    height: '100%',
  },
});
