import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { deleteTask, getTaskById, type Task } from '@/lib/database';

export default function TaskDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = Number(params.id);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        if (!Number.isFinite(id)) {
          if (alive) setTask(null);
          return;
        }
        const row = await getTaskById(id);
        if (alive) setTask(row);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Task not found</Text>
        <Text style={styles.value}>No task exists for id: {String(params.id ?? '')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Task Details</Text>
        <View style={styles.topActions}>
          <Pressable
            style={styles.editBtn}
            onPress={() => router.push({ pathname: '/add-tasks', params: { id: String(task.id) } })}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>

          <Pressable
            style={styles.deleteBtn}
            hitSlop={10}
            onPress={() => {
              const run = async () => {
                try {
                  await deleteTask(task.id);
                  router.replace('/tasks');
                } catch (e: any) {
                  Alert.alert('Delete failed', e?.message ?? String(e));
                }
              };

              if (Platform.OS === 'web') {
                const ok = globalThis.confirm?.('Delete task?\n\nThis cannot be undone.') ?? false;
                if (ok) void run();
                return;
              }

              Alert.alert('Delete task?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => void run() },
              ]);
            }}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{task.id}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>{task.title}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{task.description}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{task.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  container: { flex: 1, padding: 16, backgroundColor: '#fff', gap: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8, flex: 1 },
  topActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  editBtn: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  editBtnText: { color: '#fff', fontWeight: '800' },
  deleteBtn: { backgroundColor: '#DC2626', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  deleteBtnText: { color: '#fff', fontWeight: '800' },
  row: { gap: 4, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  label: { fontWeight: '800', color: '#111827' },
  value: { color: '#374151' },
});

