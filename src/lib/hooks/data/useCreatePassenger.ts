import { useMutation } from '@tanstack/react-query';

import { createPassenger, CreatePassengerParams } from '@/lib/server/api/endpoints';

export function useCreatePassenger() {
  return useMutation({
    mutationFn: (params: CreatePassengerParams) => createPassenger(params),
  });
}
