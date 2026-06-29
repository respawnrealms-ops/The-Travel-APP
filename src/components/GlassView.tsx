import React from 'react';
import { StyleSheet, View, ViewStyle, Platform, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/use-theme';

interface GlassViewProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
}

export function GlassView({
  children,
  style,
  intensity = 35,
  tint,
  borderRadius = 28,
}: GlassViewProps) {
  const theme = useTheme();
  
  // Set default tint based on theme
  const selectedTint = tint || (theme.text === '#ffffff' ? 'dark' : 'light');

  const containerStyle = [
    styles.container,
    { borderRadius },
    Platform.OS === 'web' && {
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      backgroundColor: selectedTint === 'dark' ? 'rgba(33, 34, 37, 0.4)' : 'rgba(240, 240, 243, 0.55)',
      borderColor: selectedTint === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
    },
    style,
  ];

  if (Platform.OS === 'web') {
    return <View style={containerStyle}>{children}</View>;
  }

  return (
    <BlurView
      intensity={intensity}
      tint={selectedTint}
      style={containerStyle}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
