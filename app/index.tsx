import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mini Task Application</Text>
      <Text style={styles.subtitle}></Text>

      <Link href="/tasks" style={styles.button}>
        <Text style={styles.buttonText}>Go to Task List</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 12 },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

