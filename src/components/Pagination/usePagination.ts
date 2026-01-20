function getPaginationRange(current: number, totalPages: number) {
  const range: (number | 'elipse')[] = [];
  const delta = 2; // Could be exctracted to config if needed

  const left = Math.max(2, current - delta);
  const right = Math.min(totalPages - 1, current + delta);

  range.push(1);

  if (left > 2) {
    range.push('elipse');
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) {
    range.push('elipse');
  }

  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}

export type Arguments = {
  total: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
};

export function usePagination({ total, limit, page, setPage }: Arguments) {
  const totalPages = Math.ceil(total / limit);

  function handlePrevious() {
    if (page === 1) return;
    setPage(Math.max(page - 1, 1));
  }
  function handleNext() {
    if (page === totalPages) return;
    setPage(Math.min(page + 1, totalPages));
  }

  function handleSetPage(newPage: number) {
    if (page === newPage) return;
    setPage(newPage);
  }
  const range = getPaginationRange(page, totalPages);
  return { range, handleNext, handlePrevious, handleSetPage, totalPages };
}
