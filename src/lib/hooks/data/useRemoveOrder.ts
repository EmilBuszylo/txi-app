import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GetOrdersParams, removeOrder } from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

import { ApiRoutes } from '@/constant/routes';
import { GetOrdersResponse } from '@/server/orders/orders.service';

export function useRemoveOrder(orderId: string, params: GetOrdersParams) {
  const queryClient = useQueryClient();
  const ordersQueryKey = [ApiRoutes.ORDERS, params.page, params.limit];

  const updateOrdersQueryData = () => {
    queryClient.setQueryData<GetOrdersResponse>(ordersQueryKey, (old) => {
      if (!old?.results) {
        return;
      }

      return {
        ...old,
        results: old.results.filter((res) => res.id !== orderId),
      };
    });
  };

  const { toast } = useToast();
  return useMutation({
    mutationFn: () => removeOrder(orderId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ordersQueryKey });

      const previousOrders = queryClient.getQueryData<GetOrdersResponse>(ordersQueryKey);

      if (previousOrders) {
        updateOrdersQueryData();
      }

      return {
        previousOrders,
      };
    },
    onError: (err, newConversation, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(ordersQueryKey, context.previousOrders);
      }
    },
    onSuccess: () => {
      toast({
        description: 'Zlecenie zostało usunięty.',
        variant: 'success',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    },
  });
}
