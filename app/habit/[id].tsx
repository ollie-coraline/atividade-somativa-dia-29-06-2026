import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useHabitStore } from '../../src/store/useHabitStore';
import { globalStyles } from '../../src/styles/global';
import BackButton from '@/components/ui/back-button';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { habits, toggleHabit, deleteHabit } = useHabitStore();

  const habit = habits.find(h => h.id === id);

  if (!habit) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Hábito não encontrado!</Text>
        <BackButton />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackButton />
      <View style={styles.card}>
        <Text style={styles.title}>{habit.name}</Text>
        
        {habit.description ? (
          <Text style={styles.description}>{habit.description}</Text>
        ) : null}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Frequência:</Text>
          <Text style={styles.value}>{habit.frequency}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Dias Seguidos:</Text>
          <Text style={styles.value}>🔥 {habit.streak}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Status Hoje:</Text>
          <Text style={styles.value}>
            {habit.completedToday ? '✅ Concluído' : '⬜ Pendente'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.toggleButton]} 
          onPress={() => toggleHabit(habit.id)}
        >
          <Text style={styles.actionButtonText}>
            {habit.completedToday ? 'Marcar como Pendente' : 'Marcar como Concluído'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => {
            deleteHabit(habit.id);
            router.back();
          }}
        >
          <Text style={styles.actionButtonText}>Excluir Hábito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
  content: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#5C6BC0',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#5C6BC0',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
