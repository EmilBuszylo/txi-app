import { format } from 'date-fns';

import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import { CreateOrderParams, GetOrdersParams } from '@/lib/server/api/endpoints';

import { Order } from '@/server/orders/order';

export const createOrder = async (input: CreateOrderParams): Promise<Order> => {
  try {
    const count = await prisma.order.count();

    return prisma.order.create({
      data: {
        internalId: createInternalId(count),
        ...input,
      },
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const PAGINATION_LIMIT = 20;

export interface GetOrdersResponse {
  meta: PaginationMeta;
  results: Order[];
}

export const getOrders = async (input: GetOrdersParams): Promise<GetOrdersResponse> => {
  const { limit, page: currentPage } = input;

  const page = currentPage - 1;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const data = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.findMany({
      skip,
      take,
      select: {
        id: true,
        internalId: true,
        externalId: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage, itemCount: data[0], take }),
    results: data[1],
  };
};

const createInternalId = (count: number) => {
  return `txi/${format(new Date(), 'yyyy/LL/d')}${count}`;
};
