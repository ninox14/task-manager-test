import {
  PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function getPaginationRange(current: number, totalPages: number) {
  const range: (number | 'elipse')[] = [];
  const delta = 2;

  const left = Math.max(2, current - delta);
  const right = Math.min(totalPages - 1, current + delta);

  // Show first page
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

  // Show last page
  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}

type Props = {
  limit: number;
  page: number;
  total: number;
  setPage: (page: number) => void;
};

export function Pagination({ limit, page, total, setPage }: Props) {
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

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            isActive={page !== 1}
            disabled={totalPages === 1 || page === 1}
            onClick={handlePrevious}
          />
        </PaginationItem>
        {range.map((item, idx) =>
          item === 'elipse' ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={idx}>
              <PaginationLink
                isActive={item === page}
                disabled={item === page}
                onClick={() => handleSetPage(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            isActive={page < totalPages}
            disabled={page === totalPages}
            onClick={handleNext}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
