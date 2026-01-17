import { createApi, retry } from '@reduxjs/toolkit/query/react';
import type { Task } from '@/features/tasks/types';
import { mockedBaseQuery, type MockedBaseQuertArgs } from '@/mock/api';

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
export type CompletionFilter = 'all' | 'active' | 'completed';

export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'completed'>;

const staggeredBaseQueryWithBailOut = retry(
  async (args: MockedBaseQuertArgs, api, extraOptions) => {
    const result = await mockedBaseQuery(args, api, extraOptions);

    // bail out of re-tries immediately if unauthorized,
    // because we know successive re-retries would be redundant
    if (result.error?.statusCode === 400) {
      retry.fail(result.error, result.meta);
    }
    if (result.error?.statusCode === 404) {
      retry.fail(result.error, result.meta);
    }

    return result;
  },
  {
    maxRetries: 3,
  }
);

export const tasksService = createApi({
  reducerPath: 'tasksService',
  baseQuery: staggeredBaseQueryWithBailOut,
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    // GET /tasks
    getTasks: builder.query<
      ApiSuccessResponse<Task[]>,
      {
        page?: number;
        limit?: number;
        sortBy?: SortBy;
        filter?: CompletionFilter;
      }
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
      extraOptions: { maxRetries: 0 },
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
      extraOptions: { maxRetries: 0 },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }],
    }),

    // DELETE /tasks/:id
    deleteTask: builder.mutation<ApiSuccessResponse<null>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      extraOptions: { maxRetries: 0 },
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
