import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'water:';

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

export async function getAllDates(): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  const waterKeys = keys.filter((k) => k.startsWith(KEY_PREFIX));
  const dates = waterKeys.map((k) => k.slice(KEY_PREFIX.length));
  dates.sort((a, b) => b.localeCompare(a));
  return dates;
}
