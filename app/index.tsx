import { View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Text } from 'react-native';
import WaterCounter from '../components/WaterCounter';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <WaterCounter />
      <Link href="/history" style={styles.link}>
        <Text style={styles.linkText}>기록 보기</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  link: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
});
