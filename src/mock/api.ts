import { type BaseQueryFn } from '@reduxjs/toolkit/query';
import {
  delay,
  maybeThrowError,
  filterTasks,
  sortTasks,
  loadTasks,
  saveTasks,
  createApiError,
  formatYupError,
  createTaskSchema,
} from './utils';
import { type Task } from '@/features/tasks/types';
import { nanoid } from '@reduxjs/toolkit';
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  CompletionFilter,
  SortBy,
} from '@/features/tasks/taskService';
import * as yup from 'yup';

export type MockedBaseQuertArgs = {
  url: string;
  method: string;
  body?: Partial<Task>;
  params?: {
    page?: number;
    limit?: number;
    completion?: CompletionFilter;
    sortBy?: SortBy;
    search?: string;
  };
};
export const mockedBaseQuery: BaseQueryFn<
  MockedBaseQuertArgs,
  ApiSuccessResponse<unknown>,
  ApiErrorResponse
> = async ({ url, method, body, params }) => {
  try {
    await delay();
    maybeThrowError();

    let tasks = loadTasks();

    // GET /api/tasks
    if (url === '/tasks' && method === 'GET') {
      const {
        page = 1,
        limit = 10,
        completion = 'all',
        search = '',
        sortBy = 'date',
      } = params || {};
      const filtered = sortTasks(
        filterTasks(tasks, completion, search),
        sortBy,
      );
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return {
        data: {
          meta: {
            total: filtered.length,
            page,
            limit,
          },
          data: paged,
        },
      };
    }

    // POST /api/tasks
    if (url === '/tasks' && method === 'POST') {
      try {
        const validatedBody = await createTaskSchema.validate(body, {
          abortEarly: false,
          stripUnknown: true,
        });

        const task: Task = {
          id: nanoid(),
          completed: false,
          createdAt: new Date().toISOString(),
          ...validatedBody,
        };

        saveTasks([task, ...tasks]);

        return {
          data: { data: task },
        };
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          return {
            error: formatYupError(err),
          };
        }

        return {
          error: {
            error: 'InternalServerError',
            message: 'Something went wrong',
            statusCode: 500,
          },
        };
      }
    }

    // PUT /api/tasks/:id
    if (url.match(/^\/tasks\/.+$/) && method === 'PUT') {
      const id = url.split('/')[2];
      tasks = tasks.map((t) => (t.id === id ? { ...t, ...body } : t));
      saveTasks(tasks);
      return { data: { data: tasks.find((t) => t.id === id)! } };
    }

    // PATCH /api/tasks/:id/toggle
    if (url.match(/^\/tasks\/.+\/toggle$/)) {
      const id = url.split('/')[2];
      tasks = tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      saveTasks(tasks);

      return { data: { data: tasks.find((t) => t.id === id)! } };
    }

    // DELETE /api/tasks/:id
    if (url.match(/^\/tasks\/.+$/) && method === 'DELETE') {
      const id = url.split('/')[2];
      saveTasks(tasks.filter((t) => t.id !== id));
      return { data: { data: null } };
    }
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as any;
    if (error?.status && error?.data) {
      return { error: error };
    }

    return {
      error: {
        status: 500,
        data: createApiError(
          500,
          'Internal Server Error',
          'Unknown mock server error',
        ),
      },
    };
  }
  return {
    error: {
      status: 404,
      data: createApiError(404, 'Not Found', `Endpoint not found`),
    },
  };
};
