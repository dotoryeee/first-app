import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getAllDates, getCount } from '../lib/storage';

type DayEntry = { date: string; count: number };

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(y, m - 1, d);
  const dayName = weekdays[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dayName})`;
}

export default function DayList() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const dates = await getAllDates();
    const list: DayEntry[] = [];
    for (const dateStr of dates) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const count = await getCount(date);
      list.push({ date: dateStr, count });
    }
    setEntries(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>불러오는 중...</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>아직 기록이 없어요.</Text>
        <Text style={styles.emptySub}>오늘 화면에서 물 마셨다를 눌러보세요.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.date}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.rowDate}>{formatDisplayDate(item.date)}</Text>
          <Text style={styles.rowCount}>{item.count}잔</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loading: {
    fontSize: 16,
    color: '#888',
  },
  empty: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowDate: {
    fontSize: 16,
    color: '#333',
  },
  rowCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565c0',
  },
});
