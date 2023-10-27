'use client';

import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useOrders } from '@/lib/hooks/data/useOrders';

import { OrdersOperatorTableMobile } from '@/components/features/order/orders-table/operator/OrdersOperatorTableMobile';
import { getOperatorColumns } from '@/components/features/order/table/getOperatorColumns';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/DataTableToolbar/DataTableToolbar';
import { DataTableToolbarMobile } from '@/components/ui/data-table/DataTableToolbar/DataTableToolbarMobile';
import { useFilters } from '@/components/ui/data-table/hooks/useFilters';
import { useSorts } from '@/components/ui/data-table/hooks/useSorts';
import Pagination from '@/components/ui/pgination';
import { TooltipProvider } from '@/components/ui/tooltip';

const initialPaginationMeta = {
  pageCount: 1,
  itemCount: 0,
  prevPage: null,
  nextPage: null,
};

const DEFAULT_LIMIT = 25;

export default function OrdersOperatorTable({ operatorId }: { operatorId: string }) {
  const { columnFilters, clearFilters, updateFilter, deleteFilter, filterParameters } = useFilters(
    {}
  );
  const { sortParameters, updateSort } = useSorts({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { data, isLoading, isFetching, error, isSuccess } = useOrders({
    page,
    limit,
    ...filterParameters,
    ...sortParameters,
    operatorId,
  });

  const columns = useMemo(() => {
    return getOperatorColumns({
      updateSort,
      sortParameters,
      params: {
        page,
        limit,
        ...filterParameters,
        ...sortParameters,
        operatorId,
      },
    });
  }, [operatorId, filterParameters, limit, page, sortParameters, updateSort]);

  return (
    <div>
      {error ? (
        <p>Wystąpił błąd, prosimy spróbować wczytać stronę ponownie</p>
      ) : (
        <>
          <div className='hidden md:block'>
            <TooltipProvider>
              <DataTable
                data={data?.results || []}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                isSuccess={isSuccess}
                meta={data?.meta || initialPaginationMeta}
                params={{
                  limit: DEFAULT_LIMIT,
                  page,
                  ...filterParameters,
                }}
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
                    dateRangeFilters={[
                      {
                        title: 'Data utworzenia',
                        name: 'createdAt',
                      },
                    ]}
                  />
                }
              />
            </TooltipProvider>
          </div>
          <div className='block md:hidden'>
            {data?.results && (
              <div className='flex flex-col gap-y-4'>
                <div className='flex items-center justify-between'>
                  <DataTableToolbarMobile
                    clearFilters={clearFilters}
                    columnFilters={columnFilters}
                    deleteFilter={deleteFilter}
                    updateFilter={updateFilter}
                    dateRangeFilters={[
                      {
                        title: 'Data utworzenia',
                        name: 'createdAt',
                      },
                    ]}
                  />
                  <Button
                    variant='ghost'
                    size='sm'
                    className='-ml-3 h-8 data-[state=open]:bg-accent'
                    onClick={() =>
                      updateSort('createdAt', sortParameters?.sort === 'desc' ? 'asc' : 'desc')
                    }
                  >
                    <span>Sortowanie</span>
                    {sortParameters?.sort === 'desc' ? (
                      <ArrowDownIcon className='ml-2 h-4 w-4' />
                    ) : sortParameters?.sort === 'asc' ? (
                      <ArrowUpIcon className='ml-2 h-4 w-4' />
                    ) : (
                      <ArrowUpDown className='ml-2 h-4 w-4' />
                    )}
                  </Button>
                </div>
                {Array.isArray(data.results) && (
                  <OrdersOperatorTableMobile
                    items={data?.results}
                    params={{ page, limit, ...filterParameters }}
                  />
                )}
                <Pagination
                  currentPage={page}
                  pagesCount={data?.meta.pageCount || initialPaginationMeta.pageCount}
                  changePage={(page) => setPage(page)}
                  nextPage={() => setPage((prev) => data?.meta.nextPage || prev)}
                  previousPage={() => setPage((prev) => data?.meta.prevPage || prev)}
                  limit={limit}
                  setLimit={setLimit}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
