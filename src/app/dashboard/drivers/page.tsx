'use client';

import { useMemo, useState } from 'react';

import { useDrivers } from '@/lib/hooks/data/useDrivers';

import { getColumns } from '@/components/features/driver/table/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import Pagination from '@/components/ui/pgination';

const initialPaginationMeta = {
  pageCount: 1,
  itemCount: 0,
  prevPage: null,
  nextPage: null,
};

const DEFAULT_LIMIT = 20;

export default function Drivers() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error, isSuccess } = useDrivers({
    page: 1,
    limit: DEFAULT_LIMIT,
  });

  const columns = useMemo(() => {
    return getColumns({ page, limit: DEFAULT_LIMIT });
  }, [page]);

  return (
    <div>
      {error ? (
        <p>Oh no, there was an error</p>
      ) : (
        <DataTable
          params={{ limit: DEFAULT_LIMIT, page }}
          pagination={
            <Pagination
              currentPage={page}
              pagesCount={data?.meta.pageCount || initialPaginationMeta.pageCount}
              changePage={(page) => setPage(page)}
              nextPage={() => setPage((prev) => data?.meta.nextPage || prev)}
              previousPage={() => setPage((prev) => data?.meta.prevPage || prev)}
            />
          }
          data={data?.results || []}
          isLoading={isLoading}
          isFetching={isFetching}
          columns={columns}
          isSuccess={isSuccess}
          meta={data?.meta || initialPaginationMeta}
        />
      )}
    </div>
  );
}
