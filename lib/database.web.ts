export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
};

type Stored = { nextId: number; tasks: Task[] };

const KEY = 'mini_task_app_v1';

function load(): Stored {
  try {
    const raw = globalThis?.localStorage?.getItem(KEY);
    if (!raw) return { nextId: 1, tasks: [] };
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed || !Array.isArray(parsed.tasks) || typeof parsed.nextId !== 'number') {
      return { nextId: 1, tasks: [] };
    }
    return parsed;
  } catch {
    return { nextId: 1, tasks: [] };
  }
}

function save(data: Stored) {
  globalThis?.localStorage?.setItem(KEY, JSON.stringify(data));
}

export async function getAllTasks(): Promise<Task[]> {
  return load().tasks.slice().sort((a, b) => b.id - a.id);
}

export async function getTaskById(id: number): Promise<Task | null> {
  return load().tasks.find((t) => t.id === id) ?? null;
}

export async function addTask(input: Omit<Task, 'id'>): Promise<number> {
  const data = load();
  const id = data.nextId++;
  const task: Task = {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status,
  };
  data.tasks.push(task);
  save(data);
  return id;
}

export async function deleteTask(id: number): Promise<void> {
  const data = load();
  data.tasks = data.tasks.filter((t) => t.id !== id);
  save(data);
}

export async function updateTask(id: number, input: Omit<Task, 'id'>): Promise<void> {
  const data = load();
  const idx = data.tasks.findIndex((t) => t.id === id);
  if (idx < 0) return;
  data.tasks[idx] = {
    id,
    title: input.title.trim(),
    description: input.description.trim(),
    status: input.status,
  };
  save(data);
}

