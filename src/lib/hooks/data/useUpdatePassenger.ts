import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePassenger, UpdatePassengerParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';
import { Passenger } from '@/server/passengers/passenger';

export function useUpdatePassenger(passengerId: string) {
  const queryClient = useQueryClient();
  const passengerQueryKey = [ApiRoutes.PASSENGERS, passengerId];

  const updatePassengerQueryData = (data: UpdatePassengerParams) => {
    queryClient.setQueryData(passengerQueryKey, (old) => {
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
      await queryClient.cancelQueries({ queryKey: passengerQueryKey });

      const previousOperator = queryClient.getQueryData<Passenger>(passengerQueryKey);

      if (previousOperator) {
        updatePassengerQueryData(data);
      }
    },
    mutationFn: (params: UpdatePassengerParams) => updatePassenger(passengerId, params),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: passengerQueryKey });
    },
  });
}
