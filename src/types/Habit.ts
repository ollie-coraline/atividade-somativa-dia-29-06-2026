export type Frequency = 'diário' | 'semanal' | 'mensal';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: Frequency;
  completedToday: boolean;
  streak: number;
  createdAt: string;
}
