import { useMutation } from '@tanstack/react-query';

import { updateDriver, UpdateDriverParams } from '@/lib/server/api/endpoints';

export function useUpdateDriver(driverId: string) {
  return useMutation({
    mutationFn: (params: UpdateDriverParams) => updateDriver(driverId, params),
  });
}
