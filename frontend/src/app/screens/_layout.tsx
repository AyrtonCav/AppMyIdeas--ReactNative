import { Stack, useRouter } from 'expo-router';
import { IdeasProvider } from '../../contexts/IdeasContext';
import React, { useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';

export default function IdeaBankLayout() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated]);

  return (
    <IdeasProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1E1E1E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Ideias' }} />
        <Stack.Screen name="create" options={{ title: 'Nova Ideia' }} />
        <Stack.Screen name="[id]" options={{ title: 'Detalhes' }} />
        <Stack.Screen name="edit" options={{ title: 'Editar Ideia' }} />
      </Stack>
    </IdeasProvider>
  );
}
