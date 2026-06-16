import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useHabitStore } from '../store/useHabitStore';
import { globalStyles } from '../styles/global';

export default function StatsScreen() {
  const { habits } = useHabitStore();

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  const dailyHabits = habits.filter(h => h.frequency === 'diário').length;
  const weeklyHabits = habits.filter(h => h.frequency === 'semanal').length;
  const monthlyHabits = habits.filter(h => h.frequency === 'mensal').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image 
        source={require('../assets/habit-tracker-banner.png')} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      <Text style={styles.title}>Minhas Estatísticas</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Geral</Text>
        <Text style={styles.metric}>Total de Hábitos: {totalHabits}</Text>
        <Text style={styles.metric}>Concluídos Hoje: {completedToday}</Text>
        <Text style={styles.metric}>Maior Sequência: {maxStreak} dias</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hábitos por Frequência</Text>
        <Text style={styles.metric}>Diário: {dailyHabits}</Text>
        <Text style={styles.metric}>Semanal: {weeklyHabits}</Text>
        <Text style={styles.metric}>Mensal: {monthlyHabits}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5C6BC0', // Cor de destaque
  },
  metric: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '80%',
    marginVertical: 10,
  },
});
