import { useMutation } from '@tanstack/react-query';

import { updateDriver, UpdateDriverParams } from '@/lib/server/api/endpoints';

export function useUpdateDriver(collectionPointId: string) {
  return useMutation({
    mutationFn: (params: UpdateDriverParams) => updateDriver(collectionPointId, params),
  });
}
