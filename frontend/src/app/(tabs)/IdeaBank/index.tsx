import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import IdeaList from '../../../components/IdeaList';
import { useIdeas } from '../../../contexts/IdeasContext';

export default function IdeaBank() {
  const router = useRouter();
  const { ideas } = useIdeas();  // Pega as ideias do contexto
  const [filter, setFilter] = useState<'Todas' | 'Hoje' | 'Favoritas' | 'Pendentes'>('Todas');

    const sortedIdeas = useMemo(() => {
      return [...ideas].sort((a, b) => {
        const dateA = new Date(a.data).getTime();
        const dateB = new Date(b.data).getTime();
        return dateB - dateA; // Maior para menor
      });
    }, [ideas]);

  const filteredIdeas = sortedIdeas.filter(idea => {
    if (filter === 'Favoritas') return idea.favorito;
    if (filter === 'Pendentes') return idea.status === 'Pendente';
    if (filter === 'Todas') return true;
    if (filter === 'Hoje') {
      const today = new Date();
      const ideaDate = new Date(idea.data);
      return today.toDateString() === ideaDate.toDateString();
    }
  });


  useEffect(() => {
    console.log(ideas);
  }, [ideas]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="flash" size={26} color="#fff" />
        <Text style={styles.headerTitle}>IDEIAS</Text>
        <TouchableOpacity onPress={() => router.push('/screens/create')}>
          <Ionicons name="add-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

        <View style={styles.filterBar}>
          {(['Todas', 'Hoje', 'Favoritas', 'Pendentes'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

      <IdeaList ideas={filteredIdeas} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212', 
  },

  header: {
    height: 56,
    backgroundColor: '#1E1E1E',
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

  filterBar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#1E1E1E',
    justifyContent: 'space-around',
  },

  filterBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 9, 
    borderRadius: 20
  },

  filterActive: { 
    backgroundColor: '#0D28FF' 
  },
  
  filterText: { 
    color: '#bbb',
    fontWeight: '500',
    fontSize: 15
  },
  
  filterTextActive: { 
    color: '#fff', 
    fontWeight: '600' 
  },
});
