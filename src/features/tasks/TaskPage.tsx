import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Pagination } from '@/components/Pagination/index';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { TaskModal } from './components/TaskModal';
import type { Task as TaskType } from './types';
import { TaskFilters, type Filters } from './components/TaskFilters';
import { useGetTasksQuery } from './taskService';
import { TaskList } from './components/TaskList';

const MAX_ITEMS_PER_PAGE = 10;

export function TaskPage() {
  const [task, setTask] = useState<TaskType | null>(null);
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
      }
    );
  function handleTaskModalOpen(open: boolean) {
    if (!open && task) {
      setTask(null);
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
        `Something went wrong while fetching tasks ${error.message ?? ''}`
      );
    }
  }, [isError, error]);

  const isUpdating = isLoading || isFetching;
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
          <TaskFilters
            setPage={setPage}
            setFilters={setFilters}
            filters={filters}
            page={page}
          />
        </div>
      </div>
      <Separator className="mt-3" />
      <TaskList
        search={debouncedSearch}
        tasks={data?.data ?? []}
        selectTask={handleSelectTask}
        isLoading={isLoading}
      />
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
