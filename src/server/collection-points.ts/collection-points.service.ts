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
      select: collectionPointSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'createCollectionPoint' });
    throw error;
  }
};

export const updateCollectionPoint = async (
  id: string,
  input: CreateCollectionPointParams
): Promise<CollectionPoint> => {
  try {
    return await prisma.collectionPoint.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
      select: collectionPointSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'updateCollectionPoint' });
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
  const { limit, page: requestPage, deletedAt } = input;

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
        deletedAt: deletedAt ? { not: null } : null,
      },
      skip,
      take,
      select: collectionPointSelectedFields,
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

export const getCollectionPoint = async (id: string): Promise<CollectionPoint> => {
  const collectionPoint = await prisma.collectionPoint.findUnique({
    where: { id },
    select: collectionPointSelectedFields,
  });

  if (!collectionPoint) {
    logger.error({ error: 'not found', stack: 'getCollectionPoint' });
    throw new Error('not found');
  }

  return collectionPoint;
};

//  soft delete
export const removeCollectionPoint = async (id: string): Promise<CollectionPoint> => {
  try {
    return await prisma.collectionPoint.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: collectionPointSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'removeCollectionPoint' });
    throw error;
  }
};

const collectionPointSelectedFields = {
  id: true,
  name: true,
  city: true,
  lat: true,
  lng: true,
  url: true,
  fullAddress: true,
  updatedAt: true,
  createdAt: true,
  deletedAt: true,
};
