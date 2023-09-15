import { useMutation } from '@tanstack/react-query';

import { createOperator, CreateOperatorParams } from '@/lib/server/api/endpoints';

export function useCreateOperator() {
  return useMutation({
    mutationFn: (params: CreateOperatorParams) => createOperator(params),
  });
}
