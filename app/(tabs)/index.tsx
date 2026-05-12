import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini Task Application</Text>
      <Text style={styles.subtitle}>Task</Text>

      <Link href="/(tabs)/tasks" style={styles.button}>
        <Text style={styles.buttonText}>Open Task List</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', color: '#22c55e', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#22c55e', marginBottom: 12, textAlign: 'center' },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16, textAlign: 'center' },
});
