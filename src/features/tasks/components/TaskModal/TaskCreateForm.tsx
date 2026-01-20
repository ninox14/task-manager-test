import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldGroup } from '@/components/ui/field';
import { formatISO } from 'date-fns';
import {
  useCreateTaskMutation,
  type CreateTaskDto,
  type ApiErrorResponse,
} from '@/features/tasks/taskService';
import { toast } from 'react-toastify';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  DescriptionField,
  DueDateField,
  PriorityField,
  TaskModalSubmit,
  TitleField,
} from './TaskFields';
import {
  defaultFormValues,
  taskFormSchema,
  type TaskFormValues,
} from './taskFormSchema';

type CreateTaskFormProps = {
  onSuccess: () => void;
};

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const form = useForm({
    resolver: yupResolver<TaskFormValues, unknown, unknown>(taskFormSchema),
    defaultValues: defaultFormValues,
  });

  async function onSubmit(data: TaskFormValues) {
    const newTask: CreateTaskDto = {
      title: data.title.trim(),
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? formatISO(data.dueDate) : undefined,
    };

    try {
      await createTask(newTask).unwrap();
      toast.success('Task created successfully');
      form.reset(defaultFormValues);
      onSuccess();
    } catch (err) {
      const error = err as {
        error: FetchBaseQueryError;
        data?: ApiErrorResponse;
      };
      toast.error(
        `Error while creating task${error?.data?.message ? `: ${error.data.message}` : ''}`,
      );
    }
  }

  return (
    <>
      <form id="create-task-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <TitleField control={form.control} />
          <DescriptionField control={form.control} />
          <PriorityField control={form.control} />
          <DueDateField control={form.control} />
        </FieldGroup>
      </form>
      <TaskModalSubmit
        formId="create-task-form"
        submitButtonText="Create"
        isLoading={isLoading}
      />
    </>
  );
}
