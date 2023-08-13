'use client';

import { useMemo, useState } from 'react';

import { useClients } from '@/lib/hooks/data/useClients';
import { useDrivers } from '@/lib/hooks/data/useDrivers';
import { useOrders } from '@/lib/hooks/data/useOrders';

import { ActionsBar } from '@/components/features/order/table/ActionsBar/ActionsBar';
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

const DEFAULT_LIMIT = 20;

export default function Orders() {
  const { columnFilters, clearFilters, updateFilter, deleteFilter, filterParameters } =
    useFilters();
  const { sortParameters, updateSort } = useSorts();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error, isSuccess } = useOrders({
    page,
    limit: DEFAULT_LIMIT,
    ...filterParameters,
    ...sortParameters,
  });

  const { data: clients } = useClients({ page: 1, limit: 1000 });
  const { data: drivers } = useDrivers({ page: 1, limit: 10000 });

  const columns = useMemo(() => {
    return getColumns({
      params: { page, limit: DEFAULT_LIMIT, ...filterParameters },
      updateSort,
      sortParameters,
    });
  }, [filterParameters, page, sortParameters, updateSort]);

  const clientsData = useMemo(() => {
    return clients?.results.map((res) => ({ label: res.name, value: res.name })) || [];
  }, [clients?.results]);

  const driversData = useMemo(() => {
    return (
      drivers?.results.map((res) => ({
        label: `${res.firstName} ${res.lastName}`,
        value: res.id,
      })) || []
    );
  }, [drivers?.results]);

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
            ActionsBar={ActionsBar}
            pagination={
              <Pagination
                currentPage={page}
                pagesCount={data?.meta.pageCount || initialPaginationMeta.pageCount}
                changePage={(page) => setPage(page)}
                nextPage={() => setPage((prev) => data?.meta.nextPage || prev)}
                previousPage={() => setPage((prev) => data?.meta.prevPage || prev)}
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
                textFilters={[
                  {
                    title: 'Nr FV klienta',
                    name: 'clientInvoice',
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
                  {
                    title: 'Klient',
                    name: 'clientName',
                    options: clientsData,
                  },
                  {
                    title: 'Kierowca',
                    name: 'driverId',
                    options: driversData,
                  },
                  {
                    title: 'Rzeczywiste Km',
                    name: 'hasActualKm',
                    options: [
                      {
                        label: 'Uzupełnione',
                        value: 'true',
                      },
                      {
                        label: 'Nie uzupełnione',
                        value: 'false',
                      },
                    ],
                  },
                  {
                    title: 'Faktura klienta',
                    name: 'haClientInvoice',
                    options: [
                      {
                        label: 'Dodana',
                        value: 'true',
                      },
                      {
                        label: 'Nie dodana',
                        value: 'false',
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
