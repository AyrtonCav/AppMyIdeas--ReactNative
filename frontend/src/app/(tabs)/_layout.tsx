import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';

interface TabIconProps {
  color: string;
  size: number;
}

export default function TabLayout() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login' as any);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  function HomeIcon({ color, size }: TabIconProps) {
    return <MaterialIcons name="home" size={size} color={color} />;
  }

  function IdeaIcon({ color, size }: TabIconProps) {
    return <MaterialIcons name="lightbulb" size={size} color={color} />;
  }

  function CalendarIcon({ color, size }: TabIconProps) {
    return <MaterialIcons name="event" size={size} color={color} />;
  }

  function ProfileIcon({ color, size }: TabIconProps) {
    return <MaterialIcons name="person" size={size} color={color} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0D28FF',
        tabBarInactiveTintColor: '#fff',
        tabBarBackground: () => (
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 1,
          height: 90,
          backgroundColor: 'rgba(65, 65, 65, 0.3)',
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarIconStyle: {
          width: 35,
          height: 35,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="IdeaBank/index"
        options={{
          title: 'Ideias',
          tabBarIcon: IdeaIcon,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendário',
          tabBarIcon: CalendarIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
