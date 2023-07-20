import { useMutation } from '@tanstack/react-query';

import { createCollectionPoint, CreateCollectionPointParams } from '@/lib/server/api/endpoints';

export function useCreateCollectionPoint() {
  return useMutation({
    mutationFn: (params: CreateCollectionPointParams) => createCollectionPoint(params),
  });
}
