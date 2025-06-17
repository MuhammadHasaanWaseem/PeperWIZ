import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // 👈 Hides the tab bar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ headerShown: false }}
      />
    </Tabs>
  );
}
