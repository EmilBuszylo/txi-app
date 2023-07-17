'use client';

import { useCollectionPoints } from '@/lib/hooks/data/useCollectionPoints';

export default function CollectionPoints() {
  const { data, isLoading, isFetching, error } = useCollectionPoints({ page: 1, limit: 20 });

  return (
    <div>
      {error ? (
        <p>Oh no, there was an error</p>
      ) : isLoading || isFetching ? (
        <p>Loading...</p>
      ) : data ? (
        <ul>
          {data.results.map((res) => (
            <li key={res.id} className='flex items-center gap-2'>
              {res.id},{res.name} ,{res.fullAddress}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
