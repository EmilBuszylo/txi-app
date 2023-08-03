'use client';

import { useState } from 'react';

import { useOrders } from '@/lib/hooks/data/useOrders';

import { ActionsBar } from '@/components/features/order/table/ActionsBar/ActionsBar';
import { columns } from '@/components/features/order/table/columns';
import { DataTable } from '@/components/ui/data-table/data-table';
import Pagination from '@/components/ui/pgination';
import { TooltipProvider } from '@/components/ui/tooltip';

const initialPaginationMeta = {
  pageCount: 1,
  itemCount: 0,
  prevPage: null,
  nextPage: null,
};

const DEFAULT_LIMIT = 20;

export default function Orders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error, isSuccess } = useOrders({
    page,
    limit: DEFAULT_LIMIT,
  });

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
          />
        </TooltipProvider>
      )}
    </div>
  );
}
