import { useEffect, useState } from 'react';
import { Task } from '@/features/tasks/Task';
import { TaskModal } from '@/features/tasks/TaskModal';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { useGetTasksQuery } from '@/features/tasks/taskService';
import { toast } from 'react-toastify';
import type { Task as TaskType } from '@/features/tasks/types';
import { TaskFilters, type Filters } from './features/tasks/TaskFilters';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [task, setTask] = useState<TaskType | undefined>();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    completion: 'all',
    search: '',
    sortBy: 'date',
  });
  const debouncedSearch = useDebounce(filters.search, 300);
  const { data, isLoading, isFetching, error, isError } = useGetTasksQuery(
    {
      completion: filters.completion,
      search: debouncedSearch.length > 2 ? debouncedSearch : '',
      sortBy: filters.sortBy,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  function handleTaskModalOpen(open: boolean) {
    // Deselect task when edit modal closes
    if (!open && task) {
      console.log('clear');
      setTask(undefined);
    }
    setTaskModalOpen(open);
  }

  function handleSelectTask(task: TaskType) {
    setTask(task);
    setTaskModalOpen(true);
  }

  useEffect(() => {
    if (isError && error) {
      toast.error(
        `Something went wrong while fetching tasks ${error.message ?? ''}`,
      );
    }
  }, [isError, error]);

  const isUpdating = isLoading || isFetching;
  return (
    <div className="bg-gray-950 p-3 w-full min-h-svh flex flex-col items-center text-slate-300 ">
      <h1 className="font-bold text-4xl">TOdo</h1>
      <div className="flex flex-col gap-1.5 items-center mt-4">
        <TaskModal
          task={task}
          open={taskModalOpen}
          setOpen={handleTaskModalOpen}
        />
        <div className="flex gap-1.5 items-center">
          <TaskFilters setFilters={setFilters} filters={filters} />
          {isUpdating && <Spinner />}
        </div>
      </div>
      <Separator className="mt-3" />
      <div className="flex flex-col items-center space-y-2 w-full mt-3">
        {data?.data.map((item) => (
          <Task key={item.id} task={item} selectTask={handleSelectTask} />
        ))}
      </div>
    </div>
  );
}

export default App;
