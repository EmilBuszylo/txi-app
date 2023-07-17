import { useQuery } from '@tanstack/react-query';

import { getOrders, GetOrdersParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useOrders(params: GetOrdersParams) {
  return useQuery({
    queryKey: [ApiRoutes.ORDERS, params.page],
    queryFn: () => getOrders(params),
    keepPreviousData: true,
  });
}
