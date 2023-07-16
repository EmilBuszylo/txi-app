'use client';

import { useOrders } from '@/lib/hooks/data/useOrders';

export default function Orders() {
  const { data, isLoading, isFetching, error } = useOrders({ page: 1, limit: 20 });

  return (
    <div>
      {error ? (
        <p>Oh no, there was an error</p>
      ) : isLoading || isFetching ? (
        <p>Loading...</p>
      ) : data ? (
        <ul>
          {data.results.map((res) => (
            <li key={res.id}>
              {res.id},{res.internalId},{res.externalId}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
