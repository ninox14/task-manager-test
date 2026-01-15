import { MOCK_CONFIG } from './config';

import { type Task } from '@/feature/tasks/types';
import type {
  ApiErrorResponse,
  Filter,
  SortBy,
} from '@/feature/tasks/taskService';

const TASKS_KEY = 'tasks';

export function loadTasks(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export const delay = () =>
  new Promise((res) =>
    setTimeout(
      res,
      Math.random() * (MOCK_CONFIG.maxDelay - MOCK_CONFIG.minDelay) +
        MOCK_CONFIG.minDelay
    )
  );

export function maybeThrowError() {
  if (Math.random() < MOCK_CONFIG.errorRate) {
    const statusCode = Math.random() > 0.5 ? 400 : 500;
    throw {
      status: statusCode,
      data: createApiError(
        statusCode,
        statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
        'Simulated network failure'
      ),
    };
  }
}

export function createApiError(
  statusCode: number,
  error: string,
  message: string | string[]
): ApiErrorResponse {
  return {
    statusCode,
    error,
    message,
  };
}

export function filterTasks(tasks: Task[], filter: Filter, search: string) {
  return tasks.filter((t) => {
    if (filter === 'active' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });
}

export function sortTasks(tasks: Task[], sortBy: SortBy) {
  switch (sortBy) {
    case 'date': {
      return [...tasks].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    case 'priority': {
      const order = { high: 0, medium: 1, low: 2 };
      return [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
    }
    case 'title': {
      return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    }
    default:
      return tasks;
  }
}
