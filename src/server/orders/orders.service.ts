import { format } from 'date-fns';
import { z } from 'zod';

import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';

import { Order } from '@/server/orders/order';

export const createOrderSchema = z.object({
  externalId: z.string().optional(),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;

export const createOrder = async (input: CreateOrder) => {
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
  }
};

const PAGINATION_LIMIT = 20;

export interface GetOrders {
  page: number;
  limit: number;
}

export interface GetOrdersResponse {
  meta: PaginationMeta;
  results: Omit<Order, 'createdAt'>[];
}

export const getOrders = async (input: GetOrders): Promise<GetOrdersResponse> => {
  const { limit, page: requestPage } = input;

  const page = requestPage ? requestPage - 1 : 0;
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
      },
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage: requestPage, itemCount: data[0], take }),
    results: data[1],
  };
};

const createInternalId = (count: number) => {
  return `txi/${format(new Date(), 'YYYY/M/d')}${count}`;
};
