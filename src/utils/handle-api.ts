import { Habit } from '../types/Habit';
import { useAuthStore } from '../store/useAuthStore';

// Ajuste o host/porta conforme necessário para seu backend local.
// Este projeto usa um backend de tarefas em `http://localhost:5000` com rotas:
// - `GET /` retorna lista de tarefas
// - `POST /save` cria tarefa
// - `POST /delete` deleta tarefa (body { _id })
// - `POST /update` atualiza tarefa (body { _id, text, dueDate, completed })
const API_URL = process.env.API_URL || 'http://localhost:5000';

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = useAuthStore.getState().token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchHabits(): Promise<Habit[]> {
  // Backend example returns tasks at root `/`
  const response = await fetch(`${API_URL}/`, { headers: getHeaders() });
  if (!response.ok) throw new Error('Falha ao buscar hábitos');
  const data = await response.json().catch(() => []);
  // Normalize backend task shape to Habit
  return (data || []).map((t: any, idx: number) => normalizeTask(t, idx));
}

export async function toggleHabit(id: string, completed: boolean, extra?: Record<string, any>): Promise<any> {
  // Backend expects update via POST /update with _id and usually text, dueDate, completed
  const body: any = { _id: id, completed };
  if (extra) Object.assign(body, extra);
  const response = await fetch(`${API_URL}/update`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error('Falha ao atualizar hábito' + (errText ? `: ${errText}` : ''));
  }
  const updated = await response.json().catch(() => ({}));
  return normalizeTask(updated);
}

export async function createHabit(data: Omit<Habit, 'id' | 'completedToday' | 'streak' | 'createdAt'>): Promise<Habit> {
  // Map our habit-like data to backend expected fields
  const payload: any = {
    text: (data as any).name ?? (data as any).text ?? 'Untitled',
    dueDate: (data as any).createdAt ?? new Date().toISOString(),
    completed: false,
    // include other possible fields
    description: (data as any).description ?? undefined,
    frequency: (data as any).frequency ?? undefined,
  };

  const response = await fetch(`${API_URL}/save`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error('Falha ao criar hábito' + (errText ? `: ${errText}` : ''));
  }
  const created = await response.json().catch(() => ({}));
  return normalizeTask(created);
}

export async function deleteHabit(id: string): Promise<void> {
  // Backend deletes via POST /delete with body { _id }
  const response = await fetch(`${API_URL}/delete`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ _id: id }),
  });
  if (!response.ok) throw new Error('Falha ao excluir hábito');
}

function normalizeTask(t: any, idx = 0): Habit {
  const id = t._id ?? t.id ?? t._id?.toString?.() ?? `${t.text ?? 'task'}-${idx}`;
  return {
    id: String(id),
    name: t.text ?? t.name ?? 'Sem título',
    description: t.description ?? '',
    frequency: (t.frequency as any) ?? 'diário',
    completedToday: !!(t.completed ?? t.completedToday),
    streak: t.streak ?? 0,
    createdAt: t.dueDate ?? t.createdAt ?? new Date().toISOString(),
  } as Habit;
}

// Authentication API
export async function loginAPI(data: any): Promise<{ token: string; user: any }> {
  // Auth endpoints are under /api/auth on this backend
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao fazer login' }));
    throw new Error(err.error || 'Falha ao fazer login');
  }
  return await response.json();
}

export async function signupAPI(data: any): Promise<{ token: string; user: any }> {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao criar conta' }));
    throw new Error(err.error || 'Falha ao criar conta');
  }
  return await response.json();
}

export async function logoutAPI(): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Falha ao fazer logout');
}
