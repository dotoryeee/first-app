import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getCount, incrementCount } from '../lib/storage';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = weekdays[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dayName})`;
}

export default function WaterCounter() {
  const [today] = useState(() => new Date());
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const c = await getCount(today);
    setCount(c);
    setLoading(false);
  }, [today]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onPress = useCallback(async () => {
    const next = await incrementCount(today);
    setCount(next);
  }, [today]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.date}>{formatDate(today)}</Text>
        <Text style={styles.loading}>불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate(today)}</Text>
      <Text style={styles.count}>{count}잔</Text>
      <Text style={styles.label}>오늘 물 마신 횟수</Text>
      <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onPress}>
        <Text style={styles.buttonText}>물 마셨다</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  count: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1565c0',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loading: {
    fontSize: 16,
    color: '#888',
  },
});
