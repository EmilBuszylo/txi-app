'use client';

import { useDrivers } from '@/lib/hooks/data/useDrivers';

export default function Orders() {
  const { data, isLoading, isFetching, error } = useDrivers({ page: 1, limit: 20 });

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
              {res.id},{res.firstName} ,{res.lastName}, {res.login}, {res.phone}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
