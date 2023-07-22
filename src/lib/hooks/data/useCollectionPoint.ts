import { useQuery } from '@tanstack/react-query';

import { getCollectionPoint } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useCollectionPoint(collectionPointId: string) {
  return useQuery({
    queryKey: [ApiRoutes.COLLECTION_POINTS, collectionPointId],
    queryFn: () => getCollectionPoint(collectionPointId),
  });
}
