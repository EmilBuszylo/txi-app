import { useQuery } from '@tanstack/react-query';

import { getOperator } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useOperator(operatorId: string) {
  return useQuery({
    queryKey: [ApiRoutes.OPERATORS, operatorId],
    queryFn: () => getOperator(operatorId),
  });
}
