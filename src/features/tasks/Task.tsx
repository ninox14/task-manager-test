import { Pencil, Trash2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  useDeleteTaskMutation,
  useToggleTaskMutation,
} from '@/features/tasks/taskService';
import type { Task } from '@/features/tasks/types';
import { format, parseJSON } from 'date-fns';
import { Spinner } from '@/components/ui/spinner';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';

type Props = { task: Task; selectTask: (task: Task) => void };

export function Task({ task, selectTask }: Props) {
  const createdAt = format(parseJSON(task.createdAt), 'dd-MM-yyyy');
  const [toggleTask, { isLoading: isUpdating }] = useToggleTaskMutation();

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  async function handleTaskToggle() {
    try {
      await toggleTask(task.id).unwrap();
      toast.success('Successfully Updated task', {
        autoClose: 2000,
      });
    } catch (err) {
      toast.error('Something went wrong while toggling task');
    }
  }

  async function handleDeleteTask() {
    try {
      await deleteTask(task.id).unwrap();
      toast.success('Successfully Deleted task', { autoClose: 2000 });
    } catch (err) {
      toast.error('Something went wrong while deleting task');
    }
  }

  const isLoading = isUpdating || isDeleting;

  return (
    <div
      className={twMerge(
        'flex relative z-0 max-w-200 w-full flex-col border border-stone-800 p-3 space-y-0.5 rounded-md',
        isLoading && 'pointer-events-none'
      )}
    >
      <div className="flex justify-between items-center gap-2">
        <Label className="hover:bg-accent/50 grow flex cursor-pointer items-center gap-3 justify-center rounded-lg border p-1.5 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950">
          <Checkbox
            id="toggle-2"
            checked={task.completed}
            onCheckedChange={handleTaskToggle}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
          <h4 className="font-bold text-2xl leading-none w-full text-wrap">
            {task.title}
          </h4>
        </Label>
        <Button size="icon" onClick={() => selectTask(task)}>
          <Pencil />
        </Button>
        <Button variant="destructive" size="icon" onClick={handleDeleteTask}>
          <Trash2Icon />
        </Button>
      </div>
      {task.description && (
        <div className="flex flex-col text">{task.description}</div>
      )}
      <div className="flex space-x-2">
        <h6 className="font-bold">Priority:</h6>
        <p>{task.priority}</p>
      </div>
      <div>
        <h6 className="font-bold inline-flex">Created At:</h6> {createdAt}
      </div>
      {task?.dueDate && (
        <div>
          <h6 className="font-bold inline-flex">Due Date:</h6>{' '}
          {format(parseJSON(task.dueDate), 'dd-MM-yyyy')}
        </div>
      )}
      {isLoading && (
        <div className="z-10 absolute rounded-md pointer-events-none bg-gray-500/50 inset-0 flex justify-center items-center w-full h-full">
          <Spinner />
        </div>
      )}
    </div>
  );
}
