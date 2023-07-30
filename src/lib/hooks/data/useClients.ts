import { useQuery } from '@tanstack/react-query';

import { getClients, GetClientsParams } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useClients(params: GetClientsParams) {
  return useQuery({
    queryKey: [ApiRoutes.CLIENTS, params.page, params.limit],
    queryFn: () => getClients(params),
  });
}
