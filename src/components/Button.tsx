import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '@/hooks/useHaptics';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'glass';
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  title,
  style,
  textStyle,
  variant = 'primary',
  icon,
}: ButtonProps) {
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 10, stiffness: 200 });
    haptics.light();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isPrimary = variant === 'primary';
  const isGlass = variant === 'glass';

  const buttonStyle = [
    styles.button,
    isGlass && styles.glassButton,
    !isPrimary && !isGlass && styles.secondaryButton,
    style,
  ];

  const content = (
    <>
      {icon}
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </>
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, buttonStyle]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={['#0F62FE', '#00C6FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    shadowColor: '#0F62FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: 'rgba(96, 100, 108, 0.1)',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    elevation: 0,
    shadowOpacity: 0,
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    elevation: 0,
    shadowOpacity: 0,
  },
  gradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#0F62FE',
  },
});
