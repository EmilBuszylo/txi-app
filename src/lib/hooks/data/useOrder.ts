import { useQuery } from '@tanstack/react-query';

import { getOrder } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: [ApiRoutes.ORDERS, orderId],
    queryFn: () => getOrder(orderId),
  });
}
