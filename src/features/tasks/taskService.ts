import { createApi } from '@reduxjs/toolkit/query/react';
import type { Task } from '@/features/tasks/types';
import { mockedBaseQuery } from '@/mock/api';

export interface ApiSuccessResponse<T> {
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  data: T;
}
export interface ApiErrorResponse {
  error: string;
  message: string | string[];
  statusCode: number;
}

export type SortBy = 'date' | 'priority' | 'title';
export type Filter = 'all' | 'active' | 'completed';

export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'completed'>;

export const tasksService = createApi({
  reducerPath: 'tasksService',
  baseQuery: mockedBaseQuery,
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    // GET /tasks
    getTasks: builder.query<
      ApiSuccessResponse<Task[]>,
      { page?: number; limit?: number; sortBy?: SortBy; filter?: Filter }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/tasks',
        params: { page, limit },
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((task) => ({
                type: 'Task' as const,
                id: task.id,
              })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    // POST /tasks
    createTask: builder.mutation<ApiSuccessResponse<Task>, CreateTaskDto>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    // PUT /tasks/:id
    updateTask: builder.mutation<
      ApiSuccessResponse<Task>,
      Partial<Task> & Pick<Task, 'id'>
    >({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }],
    }),

    // DELETE /tasks/:id
    deleteTask: builder.mutation<ApiSuccessResponse<null>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),

    // PATCH /tasks/:id/toggle
    toggleTask: builder.mutation<ApiSuccessResponse<Task>, string>({
      query: (id) => ({
        url: `/tasks/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useToggleTaskMutation,
} = tasksService;
