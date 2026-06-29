import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/use-theme';

interface ShimmerLoaderProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export function ShimmerLoader({
  width,
  height,
  borderRadius = 16,
  style,
}: ShimmerLoaderProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-150, 300]
    );
    return {
      transform: [{ translateX }],
    };
  });

  const isDarkMode = theme.text === '#ffffff';

  const baseColor = isDarkMode ? '#212225' : '#F0F0F3';
  const highlightColor = isDarkMode ? '#2E3135' : '#E0E1E6';

  return (
    <View
      style={[
        styles.container,
        { width: width as any, height, borderRadius, backgroundColor: baseColor },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 150,
  },
});
