import { useEffect } from 'react';
import { formatISO, parseISO } from 'date-fns';
import {
  useUpdateTaskMutation,
  type ApiErrorResponse,
  type CreateTaskDto,
} from '@/features/tasks/taskService';
import type { Task } from '@/features/tasks/types';
import { useForm } from 'react-hook-form';
import { taskFormSchema, type TaskFormValues } from './taskFormSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FieldGroup } from '@/components/ui/field';
import {
  DescriptionField,
  DueDateField,
  PriorityField,
  TaskModalSubmit,
  TitleField,
} from './TaskFields';

type UpdateTaskFormProps = {
  task: Task;
  onSuccess: () => void;
};

export function UpdateTaskForm({ task, onSuccess }: UpdateTaskFormProps) {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const form = useForm<TaskFormValues>({
    resolver: yupResolver<TaskFormValues, unknown, unknown>(taskFormSchema),
    defaultValues: {
      title: task.title,
      priority: task.priority,
    },
  });

  useEffect(() => {
    form.reset({
      title: task.title,
      priority: task.priority,
      dueDate: task.dueDate ? parseISO(task.dueDate) : undefined,
      description: task.description ?? '',
    });
  }, [task]);

  async function onSubmit(data: TaskFormValues) {
    const updatedTask: CreateTaskDto = {
      title: data.title.trim(),
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? formatISO(data.dueDate) : undefined,
    };

    try {
      await updateTask({ ...updatedTask, id: task.id }).unwrap();
      toast.success('Task updated successfully');
      onSuccess();
    } catch (err) {
      const error = err as {
        error: FetchBaseQueryError;
        data?: ApiErrorResponse;
      };
      toast.error(
        `Error while updating task${error?.data?.message ? `: ${error.data.message}` : ''}`,
      );
    }
  }
  return (
    <>
      <form id="update-task-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <TitleField control={form.control} />
          <DescriptionField control={form.control} />
          <PriorityField control={form.control} />
          <DueDateField control={form.control} />
        </FieldGroup>
      </form>
      <TaskModalSubmit
        formId="update-task-form"
        submitButtonText="Update"
        isLoading={isLoading}
      />
    </>
  );
}
