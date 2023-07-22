import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GetCollectionPointsParams, removeCollectionPoint } from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

import { ApiRoutes } from '@/constant/routes';
import { GetCollectionPointsResponse } from '@/server/collection-points.ts/collection-points.service';

export function useRemoveCollectionPoint(
  collectionPointId: string,
  params: GetCollectionPointsParams
) {
  const queryClient = useQueryClient();
  const collectionPointsQueryKey = [ApiRoutes.COLLECTION_POINTS, params.page, params.limit];

  const updateCollectionPointsQueryData = () => {
    queryClient.setQueryData<GetCollectionPointsResponse>(collectionPointsQueryKey, (old) => {
      if (!old?.results) {
        return;
      }

      return {
        ...old,
        results: old.results.filter((res) => res.id !== collectionPointId),
      };
    });
  };

  const { toast } = useToast();
  return useMutation({
    mutationFn: () => removeCollectionPoint(collectionPointId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: collectionPointsQueryKey });

      const previousCollectionPoint =
        queryClient.getQueryData<GetCollectionPointsResponse>(collectionPointsQueryKey);

      if (previousCollectionPoint) {
        updateCollectionPointsQueryData();
      }

      return {
        previousCollectionPoint,
      };
    },
    onError: (err, newConversation, context) => {
      if (context?.previousCollectionPoint) {
        queryClient.setQueryData(collectionPointsQueryKey, context.previousCollectionPoint);
      }
    },
    onSuccess: () => {
      toast({
        description: 'Punkt zborny został usunięty.',
        variant: 'success',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: collectionPointsQueryKey });
    },
  });
}
