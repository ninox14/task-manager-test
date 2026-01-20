import type { Task } from '../../types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateTaskForm } from './TaskCreateForm';
import { UpdateTaskForm } from './TaskUpdateForm';
type TaskModalProps = {
  task: Task | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function TaskModal({ task, open, setOpen }: TaskModalProps) {
  const handleSuccess = () => {
    setOpen(false);
  };

  const dialogMode = task ? 'Edit' : 'Create';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="max-w-fit">
          <PlusIcon />
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
        {task ? (
          <UpdateTaskForm task={task} onSuccess={handleSuccess} />
        ) : (
          <CreateTaskForm onSuccess={handleSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}
