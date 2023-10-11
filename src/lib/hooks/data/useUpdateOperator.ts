import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateOperator, UpdateOperatorParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';
import { Operator } from '@/server/operators/operator';

export function useUpdateOperator(operatorId: string) {
  const queryClient = useQueryClient();
  const operatorQueryKey = [ApiRoutes.OPERATORS, operatorId];

  const updateOperatorQueryData = (data: UpdateOperatorParams) => {
    queryClient.setQueryData(operatorQueryKey, (old) => {
      if (!old) {
        return;
      }

      return {
        old,
        ...data,
      };
    });
  };

  return useMutation({
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: operatorQueryKey });

      const previousOperator = queryClient.getQueryData<Operator>(operatorQueryKey);

      if (previousOperator) {
        updateOperatorQueryData(data);
      }
    },
    mutationFn: (params: UpdateOperatorParams) => updateOperator(operatorId, params),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: operatorQueryKey });
    },
  });
}
