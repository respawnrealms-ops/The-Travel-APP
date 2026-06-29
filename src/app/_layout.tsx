import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Artificial load to allow fonts/splash to run
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          {isLoaded && (
            <Stack screenOptions={{ headerShown: false }}>
              {/* Main Tab routes */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              
              {/* Authentication screen */}
              <Stack.Screen 
                name="auth" 
                options={{ 
                  presentation: 'transparentModal',
                  animation: 'fade',
                  headerShown: false,
                }} 
              />
              
              {/* Detailed pages */}
              <Stack.Screen 
                name="trip-details" 
                options={{ 
                  headerShown: false,
                  animation: 'slide_from_right',
                }} 
              />
              
              {/* Full-screen Modals */}
              <Stack.Screen 
                name="currency" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="weather" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="documents" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="premium" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="settings" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
            </Stack>
          )}
        </ThemeProvider>
      </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
