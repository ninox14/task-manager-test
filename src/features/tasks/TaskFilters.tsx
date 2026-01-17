import type { CompletionFilter } from './taskService';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
export type Filters = {
  completion: CompletionFilter;
};

type Props = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};
export function TaskFilters({ filters, setFilters }: Props) {
  function handleCompletionChange(completion: CompletionFilter) {
    setFilters({ ...filters, completion });
  }
  return (
    <div className="flex">
      <Select
        value={filters.completion}
        defaultValue="all"
        onValueChange={handleCompletionChange}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Completion Filter</SelectLabel>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
