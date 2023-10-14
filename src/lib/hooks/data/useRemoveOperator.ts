import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GetOperatorsParams, removeOperator } from '@/lib/server/api/endpoints';

import { useToast } from '@/components/ui/use-toast';

import { ApiRoutes } from '@/constant/routes';
import { GetOperatorResponse, GetOperatorsResponse } from '@/server/operators/operators.service';

export function useRemoveOperator(operatorId: string, params: GetOperatorsParams) {
  const queryClient = useQueryClient();
  const operatorsQueryKey = [ApiRoutes.OPERATORS, params];

  const updateOperatorQueryData = () => {
    queryClient.setQueryData<GetOperatorsResponse>(operatorsQueryKey, (old) => {
      if (!old?.results) {
        return;
      }

      return {
        ...old,
        results: old.results.filter((res) => res.id !== operatorId),
      };
    });
  };

  const { toast } = useToast();
  return useMutation({
    mutationFn: () => removeOperator(operatorId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: operatorsQueryKey });

      const previousOperators = queryClient.getQueryData<GetOperatorResponse>(operatorsQueryKey);

      if (previousOperators) {
        updateOperatorQueryData();
      }

      return {
        previousOperators,
      };
    },
    onError: (err, newConversation, context) => {
      if (context?.previousOperators) {
        queryClient.setQueryData(operatorsQueryKey, context.previousOperators);
      }
    },
    onSuccess: () => {
      toast({
        description: 'Operator został usunięty.',
        variant: 'success',
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: operatorsQueryKey });
    },
  });
}
