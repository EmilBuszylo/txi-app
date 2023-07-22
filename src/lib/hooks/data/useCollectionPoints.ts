import { useQuery } from '@tanstack/react-query';

import { getCollectionPoints, GetCollectionPointsParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useCollectionPoints(params: GetCollectionPointsParams) {
  return useQuery({
    queryKey: [ApiRoutes.COLLECTION_POINTS, params.page, params.limit],
    queryFn: () => getCollectionPoints(params),
  });
}
