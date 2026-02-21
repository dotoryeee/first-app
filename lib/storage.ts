import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'water:';
const GOAL_KEY = 'dailyGoal';
const DEFAULT_GOAL = 8;

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${KEY_PREFIX}${y}-${m}-${d}`;
}

export async function getCount(date: Date): Promise<number> {
  const key = dateKey(date);
  const value = await AsyncStorage.getItem(key);
  if (value == null) return 0;
  const n = parseInt(value, 10);
  return isNaN(n) ? 0 : n;
}

export async function incrementCount(date: Date): Promise<number> {
  const key = dateKey(date);
  const current = await getCount(date);
  const next = current + 1;
  await AsyncStorage.setItem(key, String(next));
  return next;
}

export async function decrementCount(date: Date): Promise<number> {
  const key = dateKey(date);
  const current = await getCount(date);
  const next = Math.max(0, current - 1);
  await AsyncStorage.setItem(key, String(next));
  return next;
}

export async function getAllDates(): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  const waterKeys = keys.filter((k) => k.startsWith(KEY_PREFIX));
  const dates = waterKeys.map((k) => k.slice(KEY_PREFIX.length));
  dates.sort((a, b) => b.localeCompare(a));
  return dates;
}

export async function getDailyGoal(): Promise<number> {
  const value = await AsyncStorage.getItem(GOAL_KEY);
  if (value == null) return DEFAULT_GOAL;
  const n = parseInt(value, 10);
  return isNaN(n) || n < 1 ? DEFAULT_GOAL : n;
}

export async function setDailyGoal(goal: number): Promise<void> {
  const n = Math.max(1, Math.min(99, Math.floor(goal)));
  await AsyncStorage.setItem(GOAL_KEY, String(n));
}

export type DayEntry = { dateStr: string; count: number };

export async function getLast7Days(): Promise<DayEntry[]> {
  const result: DayEntry[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const count = await getCount(d);
    result.push({ dateStr, count });
  }
  return result;
}
