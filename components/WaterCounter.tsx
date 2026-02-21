import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { getCount, incrementCount, getDailyGoal, setDailyGoal } from '../lib/storage';

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
  const [goal, setGoalState] = useState(8);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [c, g] = await Promise.all([getCount(today), getDailyGoal()]);
    setCount(c);
    setGoalState(g);
    setLoading(false);
  }, [today]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onIncrement = useCallback(async () => {
    const next = await incrementCount(today);
    setCount(next);
  }, [today]);

  const onSetGoal = useCallback(async (value: number) => {
    await setDailyGoal(value);
    setGoalState(value);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.date}>{formatDate(today)}</Text>
        <Text style={styles.loading}>불러오는 중...</Text>
      </View>
    );
  }

  const achieved = goal > 0 && count >= goal;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate(today)}</Text>
      <View style={styles.countRow}>
        <Text style={[styles.count, achieved && styles.countAchieved]}>{count}</Text>
        <Text style={styles.countUnit}> / {goal}잔</Text>
      </View>
      {achieved ? (
        <Text style={styles.achievedLabel}>목표 달성!</Text>
      ) : (
        <Text style={styles.label}>오늘 물 마신 횟수</Text>
      )}
      <View style={styles.goalRow}>
        <Text style={styles.goalLabel}>일일 목표: </Text>
        {[6, 8, 10].map((g) => (
          <Pressable
            key={g}
            style={[styles.goalChip, goal === g && styles.goalChipActive]}
            onPress={() => onSetGoal(g)}
          >
            <Text style={[styles.goalChipText, goal === g && styles.goalChipTextActive]}>{g}잔</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onIncrement}>
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
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  count: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1565c0',
  },
  countAchieved: {
    color: '#2e7d32',
  },
  countUnit: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  achievedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 8,
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
    width: '100%',
    textAlign: 'center',
    marginBottom: 4,
  },
  goalChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
  },
  goalChipActive: {
    backgroundColor: '#1565c0',
  },
  goalChipText: {
    fontSize: 14,
    color: '#1565c0',
    fontWeight: '500',
  },
  goalChipTextActive: {
    color: '#fff',
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
