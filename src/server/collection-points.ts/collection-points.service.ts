import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import { CreateCollectionPointParams, GetCollectionPointsParams } from '@/lib/server/api/endpoints';

import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

export const createCollectionPoint = async (
  input: CreateCollectionPointParams
): Promise<CollectionPoint> => {
  try {
    return prisma.collectionPoint.create({
      data: {
        ...input,
      },
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const PAGINATION_LIMIT = 20;

export interface GetCollectionPointsResponse {
  meta: PaginationMeta;
  results: CollectionPoint[];
}

export const getCollectionPoints = async (
  input: GetCollectionPointsParams
): Promise<GetCollectionPointsResponse> => {
  const { limit, page: requestPage } = input;

  const page = requestPage ? requestPage - 1 : 0;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const data = await prisma.$transaction([
    prisma.collectionPoint.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.collectionPoint.findMany({
      where: {
        deletedAt: null,
      },
      skip,
      take,
      select: {
        id: true,
        name: true,
        city: true,
        lat: true,
        lng: true,
        fullAddress: true,
        updatedAt: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage: requestPage, itemCount: data[0], take }),
    results: data[1],
  };
};
