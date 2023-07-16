import { useQuery } from '@tanstack/react-query';

import { getDrivers, GetDriversParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useDrivers(params: GetDriversParams) {
  return useQuery({
    queryKey: [ApiRoutes.DRIVERS],
    queryFn: () => getDrivers(params),
  });
}
