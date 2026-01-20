import type { Task as TaskType } from '../types';
import { Task } from './Task';
import { TasksSkeletons } from './TaskSkeleton';

type Props = {
  tasks: TaskType[];
  isLoading?: boolean;
  search: string;
  selectTask: (task: TaskType) => void;
};

export function TaskList({ tasks, isLoading, search, selectTask }: Props) {
  const isEmpty = !tasks.length && !isLoading;
  return (
    <div className="flex flex-col min-h-[calc(100svh-240px)] items-center space-y-2 w-full my-3">
      {isEmpty && (
        <h3 className="font-bold">
          No tasks {search.length > 0 && 'like this'} (๑˃̵ᴗ˂̵)/
        </h3>
      )}
      {isLoading && <TasksSkeletons />}
      {tasks.map((item) => (
        <Task key={item.id} task={item} selectTask={selectTask} />
      ))}
    </div>
  );
}
