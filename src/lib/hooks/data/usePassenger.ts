import { useQuery } from '@tanstack/react-query';

import { getPassenger } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function usePassenger(passengerId: string) {
  return useQuery({
    queryKey: [ApiRoutes.PASSENGERS, passengerId],
    queryFn: () => getPassenger(passengerId),
  });
}
