import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Pagination } from '@/components/Pagination/index';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Task } from './components/Task';
import { TaskModal } from './components/TaskModal';
import type { Task as TaskType } from './types';
import { TaskFilters, type Filters } from './components/TaskFilters';
import { useGetTasksQuery } from './taskService';
import { TasksSkeletons } from './components/TaskSkeleton';

const MAX_ITEMS_PER_PAGE = 10;

export function TaskPage() {
  const [task, setTask] = useState<TaskType | undefined>();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    completion: 'all',
    search: '',
    sortBy: 'date',
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search.trim(), 500);
  const { data, isLoading, isFetching, error, isError, refetch } =
    useGetTasksQuery(
      {
        ...filters,
        search: debouncedSearch.length > 2 ? debouncedSearch : '',
        page,
      },
      {
        refetchOnMountOrArgChange: true,
      },
    );
  function handleTaskModalOpen(open: boolean) {
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
      toast.error(
        `Something went wrong while fetching tasks ${error.message ?? ''}`,
      );
    }
  }, [isError, error]);
  // Edge case when search response has less page than currently selected
  useEffect(() => {
    if (filters.search.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(1);
    }
  }, [filters.search]);

  const isUpdating = isLoading || isFetching;
  const isEmpty = !data?.data?.length && !isUpdating;
  return (
    <>
      <div className="flex flex-col gap-1.5 items-center mt-4">
        <div className="flex gap-2">
          <TaskModal
            task={task}
            open={taskModalOpen}
            setOpen={handleTaskModalOpen}
          />
          <Button size="icon" disabled={isUpdating} onClick={refetch}>
            {isUpdating ? <Spinner /> : <RefreshCw />}
          </Button>
        </div>
        <div className="flex gap-1.5 items-center">
          <TaskFilters setFilters={setFilters} filters={filters} />
        </div>
      </div>
      <Separator className="mt-3" />
      <div className="flex flex-col min-h-[calc(100svh-240px)] items-center space-y-2 w-full my-3">
        {isEmpty && (
          <h3 className="font-bold">
            No tasks {debouncedSearch.length > 0 && 'like this'} (๑˃̵ᴗ˂̵)/
          </h3>
        )}
        {isLoading && <TasksSkeletons />}
        {data?.data.map((item) => (
          <Task key={item.id} task={item} selectTask={handleSelectTask} />
        ))}
      </div>
      <Separator />
      <div className="flex mt-2 justify-center ">
        <Pagination
          total={data?.meta?.total ?? 0}
          page={data?.meta?.page ?? page}
          limit={data?.meta?.limit ?? MAX_ITEMS_PER_PAGE}
          setPage={setPage}
        />
      </div>
    </>
  );
}
