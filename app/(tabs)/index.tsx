import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import HabitList from "../../src/components/HabitList";
import { useHabitStore } from "../../src/store/useHabitStore";
import { useAuthStore } from "../../src/store/useAuthStore";
import { globalStyles } from "../../src/styles/global";
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  ButtonGroup,
} from "@/components/ui/button";

export default function HomeScreen() {
  const {
    habits,
    loading,
    filter,
    setFilter,
    loadHabits,
    toggleHabit,
    deleteHabit,
    createHabit,
  } = useHabitStore();

  const { token, user } = useAuthStore();
  const router = useRouter();

  const [logoError, setLogoError] = useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");
  const [frequency, setFrequency] = useState<"diário" | "semanal" | "mensal">(
    "diário",
  );

  useEffect(() => {
    loadHabits();
  }, [token]);

  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) return;
    await createHabit({
      name: newHabitName,
      description: newHabitDescription,
      frequency: frequency,
    });
    setIsModalVisible(false);
    setNewHabitName("");
    setNewHabitDescription("");
    setFrequency("diário");
  };

  // agora o filtro e os dados são consumidos pela própria HabitList via store

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      <View style={styles.header}>
        {logoError ? (
          <Text style={styles.title}>Rastreador de Hábitos</Text>
        ) : (
          <Image
            source={require("../../src/assets/habit-tracker-banner.png")}
            style={styles.logo}
            resizeMode="cover"
            onError={() => setLogoError(true)}
          />
        )}
        <Text
          style={styles.subtitle}
          className="text-xl font-bold text-white-500"
        >
          {habits.length} hábito(s) cadastrado(s)
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {(["all", "completed", "pending"] as const).map((f) => {
          const isActive = filter === f;
          const label =
            f === "all"
              ? "Todos"
              : f === "completed"
                ? "Concluídos"
                : "Pendentes";
          return (
            <ButtonGroup key={f}>
              <Button onPress={() => setFilter(f)}>
                <ButtonText>{label}</ButtonText>
              </Button>
            </ButtonGroup>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={globalStyles.primaryColor}
          style={styles.loader}
        />
      ) : (
        <HabitList />
      )}

      {/* Modal de Criação de Hábito */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Hábito</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              placeholder="Nome do Hábito"
              value={newHabitName}
              onChangeText={setNewHabitName}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              placeholder="Descrição (opcional)"
              value={newHabitDescription}
              onChangeText={setNewHabitDescription}
            />

            <Text style={styles.frequencyLabel}>Frequência:</Text>
            <View style={styles.frequencyContainer}>
              {(["diário", "semanal", "mensal"] as const).map((freq) => {
                const isSelected = frequency === freq;
                const label =
                  freq === "diário"
                    ? "Diário"
                    : freq === "semanal"
                      ? "Semanal"
                      : "Mensal";
                return (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.freqButton,
                      isSelected && styles.freqButtonActive,
                    ]}
                    onPress={() => setFrequency(freq)}
                  >
                    <Text
                      style={[
                        styles.freqText,
                        isSelected && styles.freqTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleCreateHabit}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyles.backgroundColor,
  },
  header: {
    paddingVertical: 12,
    backgroundColor: globalStyles.primaryColor,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    paddingHorizontal: 16,
  },
  logo: {
    width: "100%",
    height: 120,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: "#C5CAE9",
    marginTop: 2,
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    right: 16,
    bottom: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  message: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginBottom: 18,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: globalStyles.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  outlineButton: {
    backgroundColor: "transparent",
    marginLeft: 12,
  },
  outlineButtonText: {
    color: globalStyles.primaryColor,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: "#5C6BC0",
    borderColor: "#5C6BC0",
  },
  filterButtonInactive: {
    backgroundColor: "transparent",
    borderColor: "#5C6BC0",
  },
  filterTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  filterTextInactive: {
    color: "#5C6BC0",
    fontWeight: "normal",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: globalStyles.textColor,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 8,
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  freqButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  freqButtonActive: {
    backgroundColor: "#5C6BC0",
    borderColor: "#5C6BC0",
  },
  freqText: {
    color: "#333",
  },
  freqTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    color: "#F44336",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#5C6BC0",
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  linkText: {
    color: globalStyles.primaryColor,
    fontWeight: '600',
    fontSize: 15,
  }
});
