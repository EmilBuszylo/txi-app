import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GetPassengersParams, removePassenger } from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

import { ApiRoutes } from '@/constant/routes';
import { GetPassengersResponse } from '@/server/passengers/passenger.service';

export function useRemovePassenger(passengerId: string, params: GetPassengersParams) {
  const queryClient = useQueryClient();
  const passengersQueryKey = [ApiRoutes.PASSENGERS, params];

  const updatePassengersQueryData = () => {
    queryClient.setQueryData<GetPassengersResponse>(passengersQueryKey, (old) => {
      if (!old?.results) {
        return;
      }

      return {
        ...old,
        results: old.results.filter((res) => res.id !== passengerId),
      };
    });
  };

  const { toast } = useToast();
  return useMutation({
    mutationFn: () => removePassenger(passengerId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: passengersQueryKey });

      const previousPassengers =
        queryClient.getQueryData<GetPassengersResponse>(passengersQueryKey);

      if (previousPassengers) {
        updatePassengersQueryData();
      }

      return {
        previousPassengers,
      };
    },
    onError: (err, newConversation, context) => {
      if (context?.previousPassengers) {
        queryClient.setQueryData(passengersQueryKey, context.previousPassengers);
      }
    },
    onSuccess: () => {
      toast({
        description: 'Pasażer został usunięty.',
        variant: 'success',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: passengersQueryKey });
    },
  });
}
