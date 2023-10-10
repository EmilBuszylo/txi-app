import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CreateOperatorParams,
  GetOperatorsParams,
  GetOrdersParams,
} from '@/lib/server/api/endpoints';

import { Operator } from '@/server/operators/operator';

export const createOperator = async (input: CreateOperatorParams): Promise<Operator> => {
  try {
    return await prisma.operator.create({
      data: {
        ...input,
      },
    });
  } catch (error) {
    logger.error({ error, stack: 'createOperator' });
    throw error;
  }
};

// Big limit as now we just want to get all operators for one use case
const PAGINATION_LIMIT = 1000;

export interface GetOperatorsResponse {
  meta: PaginationMeta;
  results: Operator[];
}

export const getOperators = async (input: GetOrdersParams): Promise<GetOperatorsResponse> => {
  const { limit, page: requestPage, column, sort } = input;

  const page = requestPage ? requestPage - 1 : 0;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const data = await prisma.$transaction([
    prisma.operator.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.operator.findMany({
      where: {
        deletedAt: null,
      },
      skip,
      take,
      select: operatorSelectedFields,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      orderBy: _getSortByParams({ column, sort }),
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage: requestPage, itemCount: data[0], take }),
    results: data[1],
  };
};

export type GetOperatorResponse = Pick<Operator, 'id' | 'name'>;

export const getOperator = async (id: string): Promise<GetOperatorResponse> => {
  const operator = await prisma.operator.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });

  if (!operator) {
    logger.error({ error: 'not found', stack: 'getOperator' });
    throw new Error('not found');
  }

  return operator;
};

const _getSortByParams = ({ column, sort }: Pick<GetOperatorsParams, 'column' | 'sort'>) => {
  if (!column || !sort) {
    return {
      createdAt: 'desc',
    };
  }

  return {
    [column]: sort,
  };
};

const operatorSelectedFields = {
  id: true,
  name: true,
  createdAt: true,
};
