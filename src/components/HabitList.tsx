import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { Habit } from '../types/Habit';
import HabitItem from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// TODO Q3 — substituir FlatList por SectionList agrupando por completedToday
export default function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum hábito cadastrado ainda.</Text>
      </View>
    );
  }

  const sections = [
    { title: 'Concluídos hoje', data: habits.filter(h => h.completedToday) },
    { title: 'Pendentes', data: habits.filter(h => !h.completedToday) },
  ];

  return (
    <SectionList
      sections={sections}
      extraData={habits}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <HabitItem habit={item} onToggle={onToggle} onDelete={onDelete} />
      )}
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
