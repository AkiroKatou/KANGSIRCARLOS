import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-tasks" options={{ title: 'Add / Edit Task' }} />
        <Stack.Screen name="task-detail" options={{ title: 'Task Detail' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
