import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types/Habit';
import { fetchHabits, toggleHabit as apiToggleHabit, deleteHabit as apiDeleteHabit, createHabit as apiCreateHabit } from '../utils/handle-api';

type FilterType = 'all' | 'completed' | 'pending';

interface HabitStore {
  habits: Habit[];
  loading: boolean;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  loadHabits: () => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  createHabit: (data: Omit<Habit, 'id' | 'completedToday' | 'streak' | 'createdAt'>) => Promise<void>;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      loading: true,
      filter: 'all',
      
      setFilter: (filter) => set({ filter }),
      
      loadHabits: async () => {
        set({ loading: true });
        try {
          const data = await fetchHabits();
          set({ habits: data, loading: false });
        } catch (error) {
          console.error('Failed to load habits:', error);
          set({ loading: false });
        }
      },
      
      toggleHabit: async (id) => {
        try {
          const current = get().habits.find((h) => h.id === id);
          if (!current) return;
          const newCompleted = !(current.completedToday ?? false);

          console.log('[useHabitStore] toggleHabit start', { id, currentCompleted: current.completedToday, newCompleted });

          // small delay to smooth UI transition before optimistic update
          await new Promise((res) => setTimeout(res, 120));

          // Optimistic update: apply immediately so UI reflects change
          const prevState = get().habits;
          set((state) => ({
            habits: state.habits.map((h) =>
              h.id === id
                ? {
                    ...h,
                    completedToday: newCompleted,
                    // if marking completed, increment streak locally; if unmarking, decrement conservatively
                    streak: newCompleted ? (h.streak ?? 0) + 1 : Math.max((h.streak ?? 1) - 1, 0),
                  }
                : h,
            ),
          }));

          console.log('[useHabitStore] optimistic applied', { id, newState: get().habits.find(h => h.id === id) });

          try {
            const extra = {
              text: current.name,
              dueDate: current.createdAt,
            };
            console.log('[useHabitStore] calling apiToggleHabit', { id, completed: newCompleted, extra });
            const updated = await apiToggleHabit(id, newCompleted, extra);
            console.log('[useHabitStore] apiToggleHabit returned', { id, updated });

            // If backend returned authoritative values (e.g., streak/completed), reconcile them
            if (updated) {
              // If server returned an unexpected/normalized fallback id, ignore it and keep optimistic state
              const serverId = String(updated.id ?? updated._id ?? '');
              const looksLikeFallback = serverId.startsWith('task-') || serverId === '';
              if (serverId !== String(id) || looksLikeFallback) {
                console.warn('[useHabitStore] Ignoring server response due to id mismatch or fallback payload', { id, serverId, looksLikeFallback, updated });
              } else {
                const completedFlag = updated.completed ?? updated.completedToday ?? newCompleted;
                const serverStreak = typeof updated.streak === 'number' ? updated.streak : undefined;
                set((state) => ({
                  habits: state.habits.map((h) =>
                    h.id === id
                      ? {
                          ...h,
                          completedToday: completedFlag,
                          streak: serverStreak !== undefined ? serverStreak : h.streak,
                        }
                      : h,
                  ),
                }));
                console.log('[useHabitStore] reconciled with server', { id, finalState: get().habits.find(h => h.id === id) });
              }
            }
          } catch (error) {
            console.error('Failed to toggle habit:', error);
            // Revert optimistic update on error
            set({ habits: prevState });
            console.log('[useHabitStore] reverted to prevState', { id });
          }
        } catch (error) {
          console.error('Failed to toggle habit:', error);
        }
      },
      
      deleteHabit: async (id) => {
        try {
          await apiDeleteHabit(id);
          set((state) => ({
            habits: state.habits.filter((h) => h.id !== id)
          }));
        } catch (error) {
          console.error('Failed to delete habit:', error);
        }
      },
      
      createHabit: async (data) => {
        try {
          const created = await apiCreateHabit(data);
          set((state) => ({
            habits: [...state.habits, created]
          }));
        } catch (error) {
          console.error('Failed to create habit:', error);
        }
      }
    }),
    {
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
