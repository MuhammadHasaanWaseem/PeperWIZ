import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, animation:'slide_from_left' }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false,  animation: 'slide_from_left'}} />
        <Stack.Screen 
          name="ai-screen" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_bottom',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="favorites" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="about" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="filters" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="musify" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_bottom',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="privacy-policy" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="terms-of-service" 
          options={{ 
            headerShown: false, 
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
  );
}
