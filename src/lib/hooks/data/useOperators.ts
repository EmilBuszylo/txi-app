import { useQuery } from '@tanstack/react-query';

import { getOperators, GetOperatorsParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useOperators(params: GetOperatorsParams) {
  return useQuery({
    queryKey: [ApiRoutes.OPERATORS, params.page, params.limit],
    queryFn: () => getOperators(params),
  });
}
