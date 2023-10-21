import { useMutation } from '@tanstack/react-query';

import { updateManyOrders, UpdateManyOrdersParams } from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

export function useUpdateManyOrdersWithoutCache(orderIds: string[]) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: Omit<UpdateManyOrdersParams, 'ids'>) =>
      updateManyOrders({ ids: orderIds, ...params }),
    onSuccess: async () => {
      toast({
        description:
          orderIds.length > 1 ? 'Zlecenia zostały zmienione.' : 'Zlecenie zostały zmienione.',
        variant: 'success',
      });
    },
  });
}
