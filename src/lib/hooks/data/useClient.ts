import { useQuery } from '@tanstack/react-query';

import { getClient } from '@/lib/server/api/endpoints';

import { ApiRoutes } from '@/constant/routes';

export function useClient(clientId: string) {
  return useQuery({
    queryKey: [ApiRoutes.CLIENTS, clientId],
    queryFn: () => getClient(clientId),
  });
}
