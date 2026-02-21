import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#e3f2fd' },
          headerTintColor: '#1565c0',
        }}
      >
        <Stack.Screen name="index" options={{ title: '오늘' }} />
        <Stack.Screen name="history" options={{ title: '기록' }} />
      </Stack>
    </>
  );
}
