import { Platform } from 'react-native';

export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
};

type SQLiteDatabase = {
  execAsync(sql: string): Promise<void>;
  getAllAsync<T>(sql: string, params?: any[]): Promise<T[]>;
  getFirstAsync<T>(sql: string, params?: any[]): Promise<T | null>;
  runAsync(
    sql: string,
    params?: any[]
  ): Promise<{
    lastInsertRowId?: number | string;
    changes?: number;
  }>;
};

let dbPromise: Promise<SQLiteDatabase> | null = null;

async function getDb() {
  if (Platform.OS === 'web') {
    // On web, use `lib/database.web.ts` (platform file) instead of SQLite.
    // This guard protects SSR/web bundling from pulling in SQLite WASM.
    throw new Error('SQLite is not available on web for this project.');
  }
  if (!dbPromise) {
    dbPromise = import('expo-sqlite').then((SQLite) => SQLite.openDatabaseAsync('tasks.db'));
  }
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);
  return db;
}

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Task>(
    'SELECT id, title, description, status FROM tasks ORDER BY id DESC;'
  );
  return rows;
}

export async function getTaskById(id: number): Promise<Task | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Task>(
    'SELECT id, title, description, status FROM tasks WHERE id = ?;',
    [id]
  );
  return row ?? null;
}

export async function addTask(input: Omit<Task, 'id'>): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?);',
    [input.title.trim(), input.description.trim(), input.status]
  );
  return Number(result.lastInsertRowId);
}

export async function deleteTask(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM tasks WHERE id = ?;', [id]);
}

export async function updateTask(
  id: number,
  input: Omit<Task, 'id'>
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?;',
    [input.title.trim(), input.description.trim(), input.status, id]
  );
}

