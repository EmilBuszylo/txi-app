import { useMutation } from '@tanstack/react-query';

import { updateOrder, UpdateOrderParams } from '@/lib/server/api/endpoints';

export function useUpdateOrder(orderId: string) {
  return useMutation({
    mutationFn: (params: UpdateOrderParams) => updateOrder(orderId, params),
  });
}
