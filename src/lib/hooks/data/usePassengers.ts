import { useQuery } from '@tanstack/react-query';

import { getPassengers, GetPassengersParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function usePassengers(params: GetPassengersParams) {
  return useQuery({
    queryKey: [ApiRoutes.PASSENGERS, params],
    queryFn: () => getPassengers(params),
  });
}
