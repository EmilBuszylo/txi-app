import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateOrder, UpdateOrderParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';
import { GetOrdersResponse } from '@/server/orders/orders.service';

export function useUpdateOrder(orderId: string) {
  const queryClient = useQueryClient();
  const ordersQueryKey = [ApiRoutes.ORDERS, orderId];

  const updateOrderQueryData = (data: UpdateOrderParams) => {
    queryClient.setQueryData(ordersQueryKey, (old) => {
      if (!old) {
        return;
      }

      return {
        old,
        ...data,
      };
    });
  };

  return useMutation({
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ordersQueryKey });

      const previousOrders = queryClient.getQueryData<GetOrdersResponse>(ordersQueryKey);

      if (previousOrders) {
        updateOrderQueryData(data);
      }
    },
    mutationFn: (params: UpdateOrderParams) => updateOrder(orderId, params),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  });
}
