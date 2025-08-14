import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import IdeaDashboard from '@/src/components/IdeaDashboard';
import CalendarDashboard from '@/src/components/CalendarComponent';
import { useIdeas } from '@/src/contexts/IdeasContext';
import { BlurView } from 'expo-blur';

export default function Dashboard() {
  const router = useRouter();
  const { ideas } = useIdeas();
  const [filter, setFilter] = useState('Hoje');

  const sortedIdeas = useMemo(() => {
    return [...ideas].sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return dateA - dateB;
    });
  }, [ideas]);

  const filteredIdeas = sortedIdeas.filter(idea => {
    if (filter === 'Hoje') {
      const today = new Date();
      const ideaDate = new Date(idea.data);

      if (today.toDateString() === ideaDate.toDateString()) {
        return true;
      }

      let closestIdea = null;
      let closestDiff = Infinity;

      sortedIdeas.forEach(idea => {
        const ideaDate = new Date(idea.data);
        const diff = ideaDate > today ? Math.abs(today.getTime() - ideaDate.getTime()) : Infinity;

        if (diff < closestDiff) {
          closestDiff = diff;
          closestIdea = idea;
        }
      });

      return closestIdea === idea;
    }

    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <View style={styles.header}>
        <BlurView
          intensity={50}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <Ionicons name="flash" size={26} color="#fff" />
        <Text style={styles.headerTitle}>IDEIAS</Text>
        <TouchableOpacity onPress={() => router.push('/screens/create')}>
          <Ionicons name="add-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionIdeas}>
          <MaterialIcons name="post-add" size={29} color="#fff" />
          <Text style={styles.sectionTitle}>Próximas Postagens</Text>
        </View>
        <IdeaDashboard ideas={filteredIdeas}/>

        <View style={styles.sectionIdeas}>
          <MaterialIcons name="calendar-month" size={28} color="#fff" />
          <Text style={styles.sectionTitle}>Calendário Semanal</Text>
        </View>
      <CalendarDashboard ideas={ideas}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },

  header: {
    height: 56,
    backgroundColor: 'rgba(65, 65, 65, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '700' 
  },

  sectionIdeas: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: -20,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

});
