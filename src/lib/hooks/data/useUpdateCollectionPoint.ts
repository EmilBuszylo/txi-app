import { useMutation } from '@tanstack/react-query';

import { CreateCollectionPointParams, updateCollectionPoint } from '@/lib/server/api/endpoints';

export function useUpdateCollectionPoint(
  collectionPointId: string
  // params: GetCollectionPointsParams
) {
  // const queryClient = useQueryClient();
  // const collectionPointsQueryKey = [ApiRoutes.COLLECTION_POINTS, params.page, params.limit];

  return useMutation({
    mutationFn: (params: CreateCollectionPointParams) =>
      updateCollectionPoint(collectionPointId, params),
    // onSuccess: async () => {},
  });
}
