import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Field,
  FieldContent,
  FieldError,
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
import { useController, type Control } from 'react-hook-form';
import { format } from 'date-fns';
import type { TaskFormValues } from './taskFormSchema';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
] as const;

type FieldProps = {
  control: Control<TaskFormValues>;
};

export function TitleField({ control }: FieldProps) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name: 'title', control });

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="title">Task Title</FieldLabel>
      <Input
        {...field}
        id="title"
        aria-invalid={invalid}
        placeholder="Task title"
        autoComplete="off"
      />
      {invalid && <FieldError errors={[error]} />}
    </Field>
  );
}

export function DescriptionField({ control }: FieldProps) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name: 'description', control });

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor="description">Description</FieldLabel>
      <Textarea
        {...field}
        id="description"
        placeholder="Detailed Task description"
        rows={6}
        className="min-h-24 max-h-[10svh] resize-none"
        aria-invalid={invalid}
      />
      {invalid && <FieldError errors={[error]} />}
    </Field>
  );
}

export function PriorityField({ control }: FieldProps) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name: 'priority', control });

  return (
    <Field orientation="responsive" data-invalid={invalid}>
      <FieldContent>
        <FieldLabel htmlFor="priority-select">Priority</FieldLabel>
        {invalid && <FieldError errors={[error]} />}
      </FieldContent>
      <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger
          id="priority-select"
          aria-invalid={invalid}
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
  );
}

export function DueDateField({ control }: FieldProps) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name: 'dueDate', control });

  return (
    <Field orientation="responsive" data-invalid={invalid}>
      <FieldContent>
        <FieldLabel htmlFor="due-date">Due Date</FieldLabel>
        {invalid && <FieldError errors={[error]} />}
      </FieldContent>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="due-date"
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
            id="due-date-calendar"
            selected={field.value}
            disabled={{ before: new Date() }}
            onSelect={field.onChange}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

type TaskModalSubmitProps = {
  isLoading?: boolean;
  formId: string;
  submitButtonText: string;
};
export function TaskModalSubmit({
  isLoading,
  formId,
  submitButtonText,
}: TaskModalSubmitProps) {
  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit" form={formId} disabled={isLoading}>
        {isLoading && <Spinner />}
        {submitButtonText}
      </Button>
    </DialogFooter>
  );
}
