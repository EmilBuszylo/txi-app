import { hash } from 'bcrypt';

import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CreateOperatorParams,
  GetOperatorsParams,
  GetOrdersParams,
  UpdateOperatorParams,
} from '@/lib/server/api/endpoints';

import { Operator } from '@/server/operators/operator';

export const createOperator = async (input: CreateOperatorParams): Promise<Operator> => {
  const { password, login, name } = input;

  try {
    const hashed_password = await hash(password, 12);

    return await prisma.user.create({
      data: {
        login: login,
        password: hashed_password,
        role: 'OPERATOR',
        operator: {
          create: {
            name,
          },
        },
      },
      select: operatorSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'createOperator' });
    throw error;
  }
};

export const updateOperator = async (
  id: string,
  input: UpdateOperatorParams
): Promise<Operator> => {
  const { password, login, name } = input;

  try {
    const hashed_password = !password || password === '' ? undefined : await hash(password, 12);

    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        login: login,
        password: hashed_password,
        role: 'OPERATOR',
        operator: {
          update: {
            name,
          },
        },
      },
      select: operatorSelectedFields,
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
    prisma.user.count({
      where: {
        deletedAt: null,
        role: 'OPERATOR',
      },
    }),
    prisma.user.findMany({
      where: {
        deletedAt: null,
        role: 'OPERATOR',
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    results: data[1],
  };
};

export type GetOperatorResponse = Operator;

export const getOperator = async (id: string): Promise<GetOperatorResponse> => {
  const operator = await prisma.user.findUnique({
    where: { id, role: 'OPERATOR' },
    select: operatorSelectedFields,
  });

  if (!operator) {
    logger.error({ error: 'not found', stack: 'getOperator' });
    throw new Error('not found');
  }

  return operator;
};

//  soft delete
export const removeOperator = async (id: string): Promise<Operator> => {
  try {
    return await prisma.user.update({
      where: { id, role: 'OPERATOR' },
      data: {
        deletedAt: new Date(),
      },
      select: operatorSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'removeDriver' });
    throw error;
  }
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
  login: true,
  createdAt: true,
  deletedAt: true,
  operator: {
    select: {
      id: true,
      name: true,
    },
  },
};
