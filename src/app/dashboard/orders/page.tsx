'use client';

import { useState } from 'react';

import { useOrders } from '@/lib/hooks/data/useOrders';

import { columns } from '@/components/features/order/table/columns';
import { DataTable } from '@/components/features/order/table/data-table';
import Pagination from '@/components/ui/pgination';

const initialPaginationMeta = {
  pageCount: 1,
  itemCount: 0,
  prevPage: null,
  nextPage: null,
};

export default function Orders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error, isSuccess } = useOrders({
    page,
    limit: 20,
  });

  return (
    <div>
      {error ? (
        <p>Oh no, there was an error</p>
      ) : (
        <>
          <div className='flex w-full justify-center justify-between pb-4 pt-2'>
            <div></div>
            <Pagination
              currentPage={page}
              pagesCount={data?.meta.pageCount || initialPaginationMeta.pageCount}
              changePage={(page) => setPage(page)}
              nextPage={() => setPage((prev) => data?.meta.nextPage || prev)}
              previousPage={() => setPage((prev) => data?.meta.prevPage || prev)}
            />
          </div>
          <DataTable
            data={data?.results || []}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            isSuccess={isSuccess}
            meta={data?.meta || initialPaginationMeta}
          />
        </>
      )}
    </div>
  );
}
