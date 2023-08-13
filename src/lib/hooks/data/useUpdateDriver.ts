import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateDriver, UpdateDriverParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';
import { Driver } from '@/server/drivers/driver';

export function useUpdateDriver(driverId: string) {
  const queryClient = useQueryClient();
  const driverQueryKey = [ApiRoutes.DRIVERS, driverId];

  const updateDriverQueryData = (data: UpdateDriverParams) => {
    queryClient.setQueryData(driverQueryKey, (old) => {
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
      await queryClient.cancelQueries({ queryKey: driverQueryKey });

      const previousDriver = queryClient.getQueryData<Driver>(driverQueryKey);

      if (previousDriver) {
        updateDriverQueryData(data);
      }
    },
    mutationFn: (params: UpdateDriverParams) => updateDriver(driverId, params),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: driverQueryKey });
    },
  });
}
