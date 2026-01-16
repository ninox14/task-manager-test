import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type TaskPriority, type Task } from '@/features/tasks/types';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  type ApiErrorResponse,
  type CreateTaskDto,
} from './taskService';
import { Spinner } from '@/components/ui/spinner';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, formatISO, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';

const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
] as const;

const formSchema = yup
  .object({
    title: yup.string().min(5).max(200).required(),
    description: yup.string().optional(),
    priority: yup
      .string<TaskPriority>()
      .ensure()
      .min(1, 'Please select priority')
      .required(),
    dueDate: yup
      .date()
      .min(new Date(), 'You cannot set past dates!')
      .optional(),
  })
  .required();

type Props = {
  task?: Task;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function TaskModal({ task, open, setOpen }: Props) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const form = useForm({
    resolver: yupResolver(formSchema),
    // Should be returned by the function but resolver package is bugged
    // https://github.com/react-hook-form/resolvers/issues/807
    // and all form types break
    defaultValues: {
      title: '',
      // @ts-expect-error fixing warning in runtime and preserve correct UX
      priority: '',
    },
  });
  function handleDialogOpenChange(open: boolean) {
    // Clearing form when dialog closes
    if (!open) {
      // @ts-expect-error fixing warning in runtime
      form.reset({
        description: '',
        title: '',
        dueDate: undefined,
        priority: '',
      });
    }
    setOpen(open);
  }
  async function onSubmit(data: yup.InferType<typeof formSchema>) {
    const newTask: CreateTaskDto = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? formatISO(data.dueDate) : undefined,
    };

    try {
      if (task) {
        await updateTask({ ...newTask, id: task.id }).unwrap();
      } else {
        await createTask(newTask).unwrap();
      }
      toast.success(`Task ${!task ? 'Created' : 'Updated'} successfully`);
      handleDialogOpenChange(false);
    } catch (err) {
      const error = err as {
        error: FetchBaseQueryError;
        data?: ApiErrorResponse;
      };
      let msg;
      if (error?.data) {
        msg = error.data?.message;
      }
      toast.error(`Error while submitting task${msg ? `: ${msg}` : ''}`);
    }
  }
  useEffect(() => {
    if (!task) return;
    form.reset({
      title: task?.title,
      priority: task?.priority,
      dueDate: task?.dueDate ? parseISO(task.dueDate) : undefined,
      description: task?.description ?? '',
    });
  }, [task]);

  const dialogMode = !task ? 'Create' : 'Edit';
  const isLoading = isUpdating || isCreating;
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(!open)}>
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{dialogMode} Task</DialogTitle>
          <DialogDescription>
            {dialogMode} your beautiful task
          </DialogDescription>
        </DialogHeader>
        <form id="task-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Task Title</FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Task title"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Detailed Task description"
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="priority-select">Priority</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="priority-select"
                      aria-invalid={fieldState.invalid}
                      className="min-w-30"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="due-date">Due Date</FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!field.value}
                        className="data-[empty=true]:text-muted-foreground w-70 justify-start text-left font-normal"
                      >
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        id="due-date"
                        selected={field.value}
                        disabled={{ before: new Date() }}
                        onSelect={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="task-form" disabled={isLoading}>
            {isLoading && <Spinner />}
            {!task ? 'Create' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
