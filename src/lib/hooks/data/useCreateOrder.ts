import { useMutation } from '@tanstack/react-query';

import { createOrder, CreateOrderParams } from '@/lib/server/api/endpoints';

export function useCreateOrder() {
  return useMutation({
    mutationFn: (params: CreateOrderParams) => createOrder(params),
  });
}
