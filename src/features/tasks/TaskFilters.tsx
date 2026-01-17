import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import type { CompletionFilter, SortBy } from './taskService';
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
  search: string;
  sortBy: SortBy;
};

type Props = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};
export function TaskFilters({ filters, setFilters }: Props) {
  function handleCompletionChange(completion: CompletionFilter) {
    setFilters({ ...filters, completion });
  }
  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, search: e.target.value });
  }
  function handleSortChange(sortBy: SortBy) {
    setFilters({ ...filters, sortBy });
  }
  return (
    <div className="flex justify-center gap-1.5 flex-wrap sm:flex-nowrap ">
      {/* Select element is not decomposed here
        cause of relative small size of components, same with options
        othervise should be decomposed and options generated */}
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
      <Input
        value={filters.search}
        placeholder="Search ..."
        onChange={handleSearchChange}
      />
      <Select
        value={filters.sortBy}
        defaultValue="date"
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-45">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
