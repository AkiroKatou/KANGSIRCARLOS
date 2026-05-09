import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { addTask, getTaskById, updateTask, type TaskStatus } from '@/lib/database';

const STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Done'];

export default function AddTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const editingId = params.id ? Number(params.id) : null;
  const isEditing = editingId !== null && Number.isFinite(editingId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isEditing) return;
      setLoading(true);
      try {
        const task = await getTaskById(editingId!);
        if (!alive) return;
        if (!task) {
          Alert.alert('Not found', 'This task no longer exists.');
          router.back();
          return;
        }
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [editingId, isEditing, router]);

  const canSave = useMemo(
    () => title.trim().length > 0 && description.trim().length > 0 && !saving && !loading,
    [title, description, saving, loading]
  );

  async function onSave() {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Missing info', 'Please enter both a title and description.');
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await updateTask(editingId!, { title, description, status });
      } else {
        await addTask({ title, description, status });
      }
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>{isEditing ? 'Edit Task' : 'Add Task'}</Text>

      <Text style={styles.label}>Task Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Finish activity"
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="What do you need to do?"
        style={[styles.input, styles.multiline]}
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((s) => (
          <Pressable
            key={s}
            onPress={() => setStatus(s)}
            style={[styles.statusPill, status === s && styles.statusPillSelected]}
          >
            <Text style={[styles.statusText, status === s && styles.statusTextSelected]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onSave} disabled={!canSave} style={[styles.saveButton, !canSave && styles.saveDisabled]}>
        <Text style={styles.saveButtonText}>
          {loading ? 'Loading…' : saving ? 'Saving…' : isEditing ? 'Update Task' : 'Save Task'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', gap: 10 },
  screenTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  label: { fontWeight: '700', marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusPill: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  statusPillSelected: { backgroundColor: '#111827', borderColor: '#111827' },
  statusText: { color: '#111827', fontWeight: '700', fontSize: 12 },
  statusTextSelected: { color: '#fff' },
  saveButton: {
    marginTop: 12,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveDisabled: { opacity: 0.45 },
  saveButtonText: { color: '#fff', fontWeight: '800' },
});

