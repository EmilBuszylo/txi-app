import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  GetOrdersParams,
  updateManyOrders,
  UpdateManyOrdersParams,
} from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

import { ApiRoutes } from '@/constant/routes';
import { Order } from '@/server/orders/order';
import { GetOrdersResponse } from '@/server/orders/orders.service';

interface UseUpdateManyOrdersOptions {
  disableCacheUpdate?: boolean;
  disableCustomToast?: boolean;
}

export function useUpdateManyOrders(
  orderIds: string[],
  ordersListPrams: GetOrdersParams,
  options?: UseUpdateManyOrdersOptions
) {
  const queryClient = useQueryClient();
  const ordersQueryKey = [ApiRoutes.ORDERS, ordersListPrams];

  const updateOrdersQueryData = (data: Order[]) => {
    queryClient.setQueryData<GetOrdersResponse>(ordersQueryKey, (old) => {
      if (!old?.results) {
        return;
      }

      return {
        ...old,
        results: {
          ...old.results,
          ...data,
        },
      };
    });
  };

  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: Omit<UpdateManyOrdersParams, 'ids'>) =>
      updateManyOrders({ ids: orderIds, ...params }),
    onSuccess: async (data) => {
      if (!options?.disableCacheUpdate) {
        await queryClient.cancelQueries({ queryKey: ordersQueryKey });

        const previousOrders = queryClient.getQueryData<GetOrdersResponse>(ordersQueryKey);

        if (previousOrders) {
          updateOrdersQueryData(data);
        }
      }

      if (!options?.disableCustomToast) {
        toast({
          description:
            orderIds.length > 1 ? 'Zlecenia zostały zmienione.' : 'Zlecenie zostały zmienione.',
          variant: 'success',
        });
      }
    },
    //  TODO read documentation maybe there is a better (more smooth) way to cache invalidation
    onSettled: async () => {
      if (!options?.disableCacheUpdate) {
        await queryClient.invalidateQueries({ queryKey: ordersQueryKey });
      }
    },
  });
}
