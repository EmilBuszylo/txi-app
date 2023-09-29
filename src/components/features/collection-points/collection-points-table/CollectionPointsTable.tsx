'use client';

import { useMemo, useState } from 'react';

import { useCollectionPoints } from '@/lib/hooks/data/useCollectionPoints';

import { getColumns } from '@/components/features/collection-points/table/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/DataTableToolbar/DataTableToolbar';
import { useFilters } from '@/components/ui/data-table/hooks/useFilters';
import Pagination from '@/components/ui/pgination';

const initialPaginationMeta = {
  pageCount: 1,
  itemCount: 0,
  prevPage: null,
  nextPage: null,
};

const DEFAULT_LIMIT = 25;
export const CollectionPointsTable = () => {
  const { columnFilters, clearFilters, updateFilter, deleteFilter, filterParameters } =
    useFilters();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const { data, isLoading, isFetching, error, isSuccess } = useCollectionPoints({
    page,
    limit,
    ...filterParameters,
  });

  const columns = useMemo(() => {
    return getColumns({ page, limit, ...filterParameters });
  }, [filterParameters, limit, page]);

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
          toolbar={
            <DataTableToolbar
              clearFilters={clearFilters}
              columnFilters={columnFilters}
              deleteFilter={deleteFilter}
              updateFilter={updateFilter}
              clearBtnVisible={false}
              filters={[
                {
                  title: 'status',
                  name: 'deletedAt',
                  defaultValue: 'false',
                  options: [
                    {
                      label: 'Aktywni',
                      value: 'false',
                    },
                    {
                      label: 'Usunięci',
                      value: 'true',
                    },
                  ],
                },
              ]}
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
