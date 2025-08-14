// src/app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { IdeasProvider } from '../contexts/IdeasContext';
import AuthProvider from '@/src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <IdeasProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)/_layout" />
        </Stack>
      </IdeasProvider>
    </AuthProvider>
  );
}
