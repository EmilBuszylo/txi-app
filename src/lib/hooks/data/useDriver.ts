import { useQuery } from '@tanstack/react-query';

import { getDriver } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useDriver(driverId: string) {
  return useQuery({
    queryKey: [ApiRoutes.COLLECTION_POINTS, driverId],
    queryFn: () => getDriver(driverId),
  });
}
