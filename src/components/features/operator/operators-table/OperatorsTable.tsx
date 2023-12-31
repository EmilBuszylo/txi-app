'use client';

import { useMemo, useState } from 'react';

import { useOperators } from '@/lib/hooks/data/useOperators';

import { getColumns } from '@/components/features/operator/operators-table/getColumns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { useSorts } from '@/components/ui/data-table/hooks/useSorts';
import Pagination from '@/components/ui/pgination';

const initialPaginationMeta = {
  pageCount: 1,
  itemCount: 0,
  prevPage: null,
  nextPage: null,
};

const DEFAULT_LIMIT = 25;
export const OperatorsTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { sortParameters, updateSort } = useSorts({});

  const { data, isLoading, isFetching, error, isSuccess } = useOperators({
    page,
    limit,
    ...sortParameters,
  });

  const columns = useMemo(() => {
    return getColumns({ sortParameters, updateSort, params: { page, limit, ...sortParameters } });
  }, [limit, page, sortParameters, updateSort]);

  return (
    <div>
      {error ? (
        <p>Wystąpił błąd, prosimy spróbować wczytać stronę ponownie</p>
      ) : (
        <DataTable
          params={{ limit, page }}
          pagination={
            <Pagination
              currentPage={page}
              pagesCount={data?.meta.pageCount || initialPaginationMeta.pageCount}
              changePage={(page) => setPage(page)}
              nextPage={() => setPage((prev) => data?.meta.nextPage || prev)}
              previousPage={() => setPage((prev) => data?.meta.prevPage || prev)}
              limit={limit}
              setLimit={setLimit}
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
};
