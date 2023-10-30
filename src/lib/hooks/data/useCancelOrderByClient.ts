import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  cancelOrderByClient,
  CancelOrderByClientParams,
  GetOrdersParams,
} from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

import { ApiRoutes } from '@/constant/routes';
import { Order } from '@/server/orders/order';
import { GetOrdersResponse } from '@/server/orders/orders.service';

export function useCancelOrderByClient(id: string, ordersListPrams: GetOrdersParams) {
  const queryClient = useQueryClient();
  const ordersQueryKey = [ApiRoutes.ORDERS, ordersListPrams];

  const updateOrdersQueryData = (data: Order) => {
    queryClient.setQueryData<GetOrdersResponse>(ordersQueryKey, (old) => {
      if (!old?.results) {
        return;
      }

      return {
        ...old,
        results: {
          ...old.results.map((r) => {
            if (r.id === data.id) {
              return data;
            } else {
              return r;
            }
          }),
        },
      };
    });
  };

  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: Omit<CancelOrderByClientParams, 'id'>) =>
      cancelOrderByClient({ id, ...params }),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ordersQueryKey });

      const previousOrders = queryClient.getQueryData<Order>(ordersQueryKey);

      if (previousOrders) {
        updateOrdersQueryData(data);
      }

      toast({
        description: 'Zlecenie zostało anulowane',
        variant: 'success',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  });
}
