import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getAllDates, getCount, getLast7Days, type DayEntry as StorageDayEntry } from '../lib/storage';

type DayEntry = { date: string; count: number };

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(y, m - 1, d);
  const dayName = weekdays[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${dayName})`;
}

function formatShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(y, m - 1, d);
  return `${m}/${d} (${weekdays[date.getDay()]})`;
}

export default function DayList() {
  const [entries, setEntries] = useState<DayEntry[]>([]);
  const [weekData, setWeekData] = useState<StorageDayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [dates, last7] = await Promise.all([getAllDates(), getLast7Days()]);
    setWeekData(last7);
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

  const weekTotal = weekData.reduce((s, e) => s + e.count, 0);
  const weekAvg = weekData.length ? Math.round((weekTotal / weekData.length) * 10) / 10 : 0;

  const renderWeekSummary = () => (
    <View style={styles.weekSummary}>
      <Text style={styles.weekTitle}>최근 7일</Text>
      {weekData.map((e) => (
        <View key={e.dateStr} style={styles.weekRow}>
          <Text style={styles.weekDate}>{formatShortDate(e.dateStr)}</Text>
          <Text style={styles.weekCount}>{e.count}잔</Text>
        </View>
      ))}
      <View style={styles.weekAvgRow}>
        <Text style={styles.weekAvgLabel}>평균</Text>
        <Text style={styles.weekAvgValue}>{weekAvg}잔/일</Text>
      </View>
      <Text style={styles.sectionTitle}>전체 기록</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.empty}>기록이 있는 날만 아래에 표시됩니다.</Text>
    </View>
  );

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.date}
      ListHeaderComponent={renderWeekSummary}
      ListEmptyComponent={renderEmpty}
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
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  weekSummary: {
    backgroundColor: '#f5f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  weekTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekDate: {
    fontSize: 14,
    color: '#444',
  },
  weekCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565c0',
  },
  weekAvgRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e3f2fd',
  },
  weekAvgLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  weekAvgValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1565c0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
