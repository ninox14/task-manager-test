import { useEffect, useState } from 'react';
import { Task } from '@/features/tasks/Task';
import { TaskModal } from '@/features/tasks/TaskModal';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import type { Task as TaskType } from '@/features/tasks/types';
import { TaskFilters, type Filters } from '@/features/tasks/TaskFilters';
import { useGetTasksQuery } from '@/features/tasks/taskService';
import { toast } from 'react-toastify';
import { useDebounce } from '@/hooks/useDebounce';
import { Pagination } from '@/components/Pagination';

const MAX_ITEMS_PER_PAGE = 10;

function App() {
  const [task, setTask] = useState<TaskType | undefined>();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    completion: 'all',
    search: '',
    sortBy: 'date',
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search, 500);
  const { data, isLoading, isFetching, error, isError } = useGetTasksQuery(
    {
      completion: filters.completion,
      search: debouncedSearch.length > 2 ? debouncedSearch : '',
      sortBy: filters.sortBy,
      page,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  function handleTaskModalOpen(open: boolean) {
    // Deselect task when edit modal closes
    if (!open && task) {
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
      if (data?.meta?.page && data?.meta?.page !== page) {
        setPage(data.meta.page);
      }
      toast.error(
        `Something went wrong while fetching tasks ${error.message ?? ''}`,
      );
    }
  }, [isError, error, data?.meta?.page]);
  // Edge case when search has less page than currently selected
  useEffect(() => {
    if (filters.search) {
      setPage(1);
    }
  }, [filters.search]);

  const isUpdating = isLoading || isFetching;
  const isEmpty = !data?.data?.length && !isUpdating;
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
      <div className="flex flex-col items-center space-y-2 w-full my-3">
        {isEmpty && (
          <h3 className="font-bold">
            No tasks {debouncedSearch.length > 0 && 'like this'} (๑˃̵ᴗ˂̵)/
          </h3>
        )}
        {data?.data.map((item) => (
          <Task key={item.id} task={item} selectTask={handleSelectTask} />
        ))}
      </div>
      <Separator />
      <div className="flex mt-2 justify-center ">
        <Pagination
          total={data?.meta?.total ?? 0}
          page={page}
          limit={data?.meta?.limit ?? MAX_ITEMS_PER_PAGE}
          setPage={setPage}
        />
      </div>
    </div>
  );
}

export default App;
