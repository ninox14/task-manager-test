import {
  PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  usePagination,
  type Arguments as PaginationArguments,
} from './usePagination';

type Props = PaginationArguments;

export function Pagination({ page, limit, setPage, total }: Props) {
  const { handleNext, handlePrevious, handleSetPage, range, totalPages } =
    usePagination({ limit, page, setPage, total });

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
            disabled={page === totalPages || !totalPages}
            onClick={handleNext}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
