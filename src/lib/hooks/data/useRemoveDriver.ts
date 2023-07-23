import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GetDriversParams, removeDriver } from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

import { ApiRoutes } from '@/constant/routes';
import { GetDriversResponse } from '@/server/drivers/drivers.service';

export function useRemoveDriver(driverId: string, params: GetDriversParams) {
  const queryClient = useQueryClient();
  const driversQueryKey = [ApiRoutes.DRIVERS, params.page, params.limit];

  const updateDriversQueryData = () => {
    queryClient.setQueryData<GetDriversResponse>(driversQueryKey, (old) => {
      if (!old?.results) {
        return;
      }

      return {
        ...old,
        results: old.results.filter((res) => res.id !== driverId),
      };
    });
  };

  const { toast } = useToast();
  return useMutation({
    mutationFn: () => removeDriver(driverId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: driversQueryKey });

      const previousDrivers = queryClient.getQueryData<GetDriversResponse>(driversQueryKey);

      if (previousDrivers) {
        updateDriversQueryData();
      }

      return {
        previousDrivers,
      };
    },
    onError: (err, newConversation, context) => {
      if (context?.previousDrivers) {
        queryClient.setQueryData(driversQueryKey, context.previousDrivers);
      }
    },
    onSuccess: () => {
      toast({
        description: 'Kierowca został usunięty.',
        variant: 'success',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: driversQueryKey });
    },
  });
}
