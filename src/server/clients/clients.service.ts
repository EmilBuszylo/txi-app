import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import { GetCollectionPointsParams } from '@/lib/server/api/endpoints';

import { Client } from '@/server/clients/clients';

const PAGINATION_LIMIT = 20;

export interface GetClientsResponse {
  meta: PaginationMeta;
  results: Pick<Client, 'id' | 'name'>[];
}

export const getClients = async (input: GetCollectionPointsParams): Promise<GetClientsResponse> => {
  const { limit, page: requestPage } = input;

  const page = requestPage ? requestPage - 1 : 0;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const data = await prisma.$transaction([
    prisma.client.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.client.findMany({
      where: {
        deletedAt: null,
      },
      skip,
      take,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage: requestPage, itemCount: data[0], take }),
    results: data[1],
  };
};
