import { useMutation } from '@tanstack/react-query';

import { createDriver, CreateDriverParams } from '@/lib/server/api/endpoints';

export function useCreateDriver() {
  return useMutation({
    mutationFn: (params: CreateDriverParams) => createDriver(params),
  });
}
