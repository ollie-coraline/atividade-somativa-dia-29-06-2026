import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Habit } from '../types/Habit';
import HabitItem from './HabitItem';
import { useHabitStore } from '../store/useHabitStore';

// HabitList agora consome a store diretamente para evitar prop drilling
export default function HabitList() {
  const habits = useHabitStore((s) => s.habits);
  const filter = useHabitStore((s) => s.filter);

  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum hábito cadastrado ainda.</Text>
      </View>
    );
  }

  const filtered = habits.filter((habit) => {
    if (filter === 'completed') return habit.completedToday;
    if (filter === 'pending') return !habit.completedToday;
    return true;
  });

  const sections = [
    { title: 'Concluídos hoje', data: filtered.filter((h) => h.completedToday) },
    { title: 'Pendentes', data: filtered.filter((h) => !h.completedToday) },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item: Habit) => item.id}
      renderItem={({ item }) => <HabitItem habit={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      renderSectionFooter={({ section }) => (
        section.data.length === 0 ? (
          <Text style={styles.emptyCategoryText}>Nenhum hábito nesta categoria.</Text>
        ) : null
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  sectionHeader: {
    backgroundColor: '#EEEEEE',
    fontWeight: 'bold',
    padding: 12,
  },
  emptyCategoryText: {
    padding: 12,
    color: '#757575',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
});
