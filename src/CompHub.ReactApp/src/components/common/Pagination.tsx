import { Pagination as BsPagination } from 'react-bootstrap';
import { type JSX } from 'react';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const ELLIPSIS = '...' as const;
type PageItem = number | typeof ELLIPSIS;

const buildPages = (current: number, total: number): PageItem[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: PageItem[] = [1];

    if (current > 3) pages.push(ELLIPSIS);

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push(ELLIPSIS);

    pages.push(total);
    return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }: Props): JSX.Element | null => {
    if (totalPages <= 1) return null;

    const pages = buildPages(currentPage, totalPages);

    return (
        <BsPagination className="justify-content-center mt-4">
            <BsPagination.Prev
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            />
            {pages.map((page, idx) =>
                page === ELLIPSIS ? (
                    <BsPagination.Ellipsis key={`ellipsis-${idx}`} disabled />
                ) : (
                    <BsPagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </BsPagination.Item>
                )
            )}
            <BsPagination.Next
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </BsPagination>
    );
};

export default Pagination;