import { Skeleton } from '@/components/ui/skeleton';
export function TaskSkeleton() {
  return (
    <div className="flex max-w-200 w-full flex-col border border-stone-800 p-3 space-y-3 rounded-md">
      <Skeleton className="h-5 w-80" />
      <Skeleton className="h-4 w-60" />
      <Skeleton className="h-4 w-15" />
      <Skeleton className="h-4 w-15" />
    </div>
  );
}
