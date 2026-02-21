import { View, StyleSheet } from 'react-native';
import DayList from '../components/DayList';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <DayList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
