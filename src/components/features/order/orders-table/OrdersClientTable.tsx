'use client';

import { useMemo, useState } from 'react';

import { useOrders } from '@/lib/hooks/data/useOrders';

import { getColumns } from '@/components/features/order/table/columns';
import { statusLabelPerStatus } from '@/components/features/order/utils';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/DataTableToolbar/DataTableToolbar';
import { useFilters } from '@/components/ui/data-table/hooks/useFilters';
import { useSorts } from '@/components/ui/data-table/hooks/useSorts';
import Pagination from '@/components/ui/pgination';
import { TooltipProvider } from '@/components/ui/tooltip';

import { OrderStatus } from '@/server/orders/order';

const initialPaginationMeta = {
  pageCount: 1,
  itemCount: 0,
  prevPage: null,
  nextPage: null,
};

const DEFAULT_LIMIT = 25;

const availableColumns = [
  'orderNumber',
  'externalId',
  'status',
  'locationFrom',
  'locationFrom.date',
  'createdAt',
];

export default function OrdersClientTable({ clientId }: { clientId: string }) {
  const { columnFilters, clearFilters, updateFilter, deleteFilter, filterParameters } =
    useFilters();
  const { sortParameters, updateSort } = useSorts();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const { data, isLoading, isFetching, error, isSuccess } = useOrders({
    page,
    limit,
    ...filterParameters,
    ...sortParameters,
    clientId,
  });

  const columns = useMemo(() => {
    return getColumns({
      params: { page, limit, ...filterParameters, clientId },
      updateSort,
      sortParameters,
    }).filter(
      (column) =>
        (column.id && availableColumns.includes(column.id)) ||
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //   @ts-ignore
        (column?.accessorKey && availableColumns.includes(column.accessorKey))
    );
  }, [clientId, filterParameters, limit, page, sortParameters, updateSort]);

  return (
    <div>
      {error ? (
        <p>Oh no, there was an error</p>
      ) : (
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
                filters={[
                  {
                    title: 'Status',
                    name: 'status',
                    options: [
                      {
                        label: statusLabelPerStatus[OrderStatus.NEW],
                        value: OrderStatus.NEW,
                      },
                      {
                        label: statusLabelPerStatus[OrderStatus.STARTED],
                        value: OrderStatus.STARTED,
                      },
                      {
                        label: statusLabelPerStatus[OrderStatus.IN_PROGRESS],
                        value: OrderStatus.IN_PROGRESS,
                      },
                      {
                        label: statusLabelPerStatus[OrderStatus.COMPLETED],
                        value: OrderStatus.COMPLETED,
                      },
                      {
                        label: statusLabelPerStatus[OrderStatus.CANCELLED],
                        value: OrderStatus.CANCELLED,
                      },
                    ],
                  },
                ]}
              />
            }
          />
        </TooltipProvider>
      )}
    </div>
  );
}
