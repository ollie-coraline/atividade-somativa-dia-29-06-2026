import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Habit } from "../types/Habit";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitItem({
  habit,
  onToggle,
  onDelete,
}: HabitItemProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkButton}
        onPress={() => onToggle(habit.id)}
      >
        <Text style={styles.checkIcon}>{habit.completedToday ? '✅' : '⬜'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.info}
        onPress={() => router.push(`/habit/${habit.id}`)}
      >
        <Text
          style={[styles.name, habit.completedToday && styles.nameCompleted]}
        >
          {habit.name}
        </Text>

        {habit.description ? (
          <Text style={styles.description}>{habit.description}</Text>
        ) : null}

        {/* TODO Q2a — exibir etiqueta de frequency com cor correspondente */}
        <View
          style={[
            styles.frequencyTag,
            habit.frequency === "diário" && { backgroundColor: "#C8E6C9" },
            habit.frequency === "semanal" && { backgroundColor: "#BBDEFB" },
            habit.frequency === "mensal" && { backgroundColor: "#FFE0B2" },
          ]}
        >
          <Text
            style={[
              styles.frequencyText,
              habit.frequency === "diário" && { color: "#2E7D32" },
              habit.frequency === "semanal" && { color: "#1565C0" },
              habit.frequency === "mensal" && { color: "#E65100" },
            ]}
          >
            {habit.frequency}
          </Text>
        </View>

        <Text style={styles.streak}>🔥 {habit.streak} dia(s) seguidos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(habit.id)}
      >
        <Text style={styles.deleteText}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  checkButton: {
    marginRight: 12,
  },
  checkIcon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  nameCompleted: {
    textDecorationLine: "line-through",
    color: "#9E9E9E",
  },
  description: {
    fontSize: 13,
    color: "#757575",
    marginTop: 2,
  },
  frequencyTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 6,
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  streak: {
    fontSize: 12,
    color: "#FF7043",
    marginTop: 4,
  },
  deleteButton: {
    paddingLeft: 8,
  },
  deleteText: {
    fontSize: 20,
  },
});
