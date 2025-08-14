import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StatusBar, StyleSheet, ScrollView } from "react-native";
import CalendarComponent from "@/src/components/CalendarTest";
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useIdeas } from "@/src/contexts/IdeasContext";

export default function CalendarScreen() {
    const { ideas } = useIdeas(); 
    const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="flash" size={26} color="#fff" />
        <Text style={styles.headerTitle}>CALENDÁRIO</Text>
        <TouchableOpacity onPress={() => router.push('/screens/create')}>
          <Ionicons name="add-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      <CalendarComponent ideas={ideas} />
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
});

