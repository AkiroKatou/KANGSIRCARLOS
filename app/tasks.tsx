import { Link, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { deleteTask, getAllTasks, type Task } from '@/lib/database';

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getAllTasks();
      setTasks(rows);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onDelete = useCallback(
    (id: number) => {
      const run = async () => {
        try {
          await deleteTask(id);
          await load();
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
    },
    [load]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Your Tasks</Text>
        <Link href="/(tabs)/add-task" style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Link>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={tasks.length ? undefined : styles.emptyContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Tap “+ Add” to create one.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.cardPressArea}
              onPress={() => router.push({ pathname: '/task-detail', params: { id: String(item.id) } })}
            >
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.badge}>{item.status}</Text>
              </View>

              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </Pressable>

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.editButton}
                hitSlop={10}
                onPress={() => router.push({ pathname: '/add-tasks', params: { id: String(item.id) } })}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </Pressable>

              <Pressable style={styles.deleteButton} hitSlop={10} onPress={() => onDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '700' },
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButtonText: { color: '#fff', fontWeight: '700' },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    gap: 8,
  },
  cardPressArea: { gap: 8 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', flex: 1 },
  badge: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  cardDesc: { color: '#374151' },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  editButton: { alignSelf: 'flex-start' },
  editButtonText: { color: '#2563EB', fontWeight: '800' },
  deleteButton: { alignSelf: 'flex-start' },
  deleteButtonText: { color: '#DC2626', fontWeight: '700' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyText: { textAlign: 'center', color: '#6B7280' },
});

