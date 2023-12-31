'use client';

import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useClients } from '@/lib/hooks/data/useClients';
import { useDrivers } from '@/lib/hooks/data/useDrivers';
import { useOperators } from '@/lib/hooks/data/useOperators';
import { useOrders } from '@/lib/hooks/data/useOrders';
import { UseIsDispatcherRole } from '@/lib/hooks/useIsDispatcherRole';
import { getCurrentQueryParams } from '@/lib/queryParams';

import { clientTableAllowedFilters } from '@/components/features/order/orders-table/consts';
import { createFiltersConfig } from '@/components/features/order/orders-table/createFiltersConfig';
import { OrdersTableMobile } from '@/components/features/order/orders-table/OrdersTableMobile';
import { ActionsBar } from '@/components/features/order/table/ActionsBar/ActionsBar';
import { getColumns } from '@/components/features/order/table/columns';
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

export default function OrdersTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { isDispatcher } = UseIsDispatcherRole();
  const { sortParameters, updateSort } = useSorts({
    withQueryParams: true,
    resetPage: () => setPage(1),
  });
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || DEFAULT_LIMIT);
  const { columnFilters, clearFilters, updateFilter, deleteFilter, filterParameters } = useFilters({
    withQueryParams: true,
    allowedParameters: clientTableAllowedFilters,
    resetPage: () => setPage(1),
  });
  const [noLimit, setNoLimit] = useState(false);
  const { data, isLoading, isFetching, error, isSuccess } = useOrders({
    page,
    limit,
    noLimit,
    ...filterParameters,
    ...sortParameters,
  });

  const { data: clients } = useClients({ page: 1, limit: 1000 });
  const { data: drivers } = useDrivers({ page: 1, limit: 10000 });
  const { data: operators } = useOperators({ page: 1, limit: 10000 });

  const columns = useMemo(() => {
    const cols = getColumns({
      params: { page, limit, noLimit, ...filterParameters, ...sortParameters },
      updateSort,
      sortParameters,
    });

    if (isDispatcher) {
      return cols.filter(
        (el) => el.id && !['actualKm', 'kmForDriver', 'stopTime', 'highwaysCost'].includes(el.id)
      );
    }

    return cols;
  }, [filterParameters, isDispatcher, limit, noLimit, page, sortParameters, updateSort]);

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

  const operatorsData = useMemo(() => {
    return (
      operators?.results
        .filter((res) => res.operator)
        .map((res) => ({
          label: res.operator?.name || res.login,
          value: res.operator?.id || '',
        })) || []
    );
  }, [operators?.results]);

  const setPageHandler = (p?: number | null) => {
    if (p) {
      const params = getCurrentQueryParams(searchParams, ['page'], { page: p.toString() });
      router.push(`${pathname}?${params}`);
    }
    setPage((prev) => p || prev);
  };

  const hiddenColumns = useMemo(() => {
    const state = localStorage.getItem('ordersColumnsSettings');

    if (state) {
      return JSON.parse(state)?.hiddenColumns || {};
    }

    return {};
  }, []);

  return (
    <div>
      {error ? (
        <p>Wystąpił błąd, prosimy spróbować wczytać stronę ponownie</p>
      ) : (
        <>
          <div className='hidden md:block'>
            <TooltipProvider>
              <DataTable
                defaultHiddenColumns={hiddenColumns}
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
                ActionsBar={!isDispatcher ? ActionsBar : undefined}
                pagination={
                  <Pagination
                    currentPage={page}
                    pagesCount={data?.meta.pageCount || initialPaginationMeta.pageCount}
                    changePage={(page) => setPageHandler(page)}
                    nextPage={() => setPageHandler(data?.meta.nextPage)}
                    previousPage={() => setPageHandler(data?.meta.prevPage)}
                    limit={limit}
                    setLimit={setLimit}
                    isNoLimit={noLimit}
                    setNoLimit={setNoLimit}
                    withQueryParams={true}
                    resetPage={() => setPage(1)}
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
                    filters={createFiltersConfig({ clientsData, driversData, operatorsData })}
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
                    textFilters={[
                      {
                        title: 'Nr FV klienta',
                        name: 'clientInvoice',
                      },
                    ]}
                    filters={createFiltersConfig({ clientsData, driversData, operatorsData })}
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
                  <OrdersTableMobile
                    items={data?.results}
                    params={{ page, limit, noLimit, ...filterParameters }}
                  />
                )}
                <Pagination
                  currentPage={page}
                  pagesCount={data?.meta.pageCount || initialPaginationMeta.pageCount}
                  changePage={(page) => setPageHandler(page)}
                  nextPage={() => setPageHandler(data?.meta.nextPage)}
                  previousPage={() => setPageHandler(data?.meta.prevPage)}
                  limit={limit}
                  setLimit={setLimit}
                  isNoLimit={noLimit}
                  setNoLimit={setNoLimit}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
