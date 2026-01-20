import * as yup from 'yup';
import type { TaskPriority } from '@/features/tasks/types';

export const taskFormSchema = yup.object().shape({
  title: yup.string().min(5).max(200).trim().required(),
  description: yup.string().optional(),
  priority: yup
    .string<TaskPriority>()
    .ensure()
    .min(1, 'Please select priority')
    .required(),
  dueDate: yup
    .date()
    .min(new Date(), 'You cannot set past dates!')
    .transform((value, originalValue) => {
      return originalValue === null ? undefined : value;
    })
    .optional(),
});

export type TaskFormValues = yup.InferType<typeof taskFormSchema>;

export const defaultFormValues: TaskFormValues = {
  title: '',
  description: '',
  priority: '' as TaskPriority,
  dueDate: undefined,
};
