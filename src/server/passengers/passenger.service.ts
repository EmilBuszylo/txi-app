import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CreatePassengerParams,
  GetOperatorsParams,
  GetPassengersParams,
  UpdatePassengerParams,
} from '@/lib/server/api/endpoints';

import { Passenger } from '@/server/passengers/passenger';

export const createPassenger = async (input: CreatePassengerParams): Promise<Passenger> => {
  const { clients, ...rest } = input;
  try {
    return await prisma.passenger.create({
      data: {
        ...rest,
        clients: {
          connect: clients.map((id) => ({ id: id })),
        },
      },
      select: passengerSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'createPassenger' });
    throw error;
  }
};

export const updatePassenger = async (
  id: string,
  input: UpdatePassengerParams
): Promise<Passenger> => {
  try {
    const { clients, ...rest } = input;

    return await prisma.passenger.update({
      where: {
        id,
      },
      data: {
        ...rest,
        clients: {
          set: clients.map((id) => ({ id: id })),
        },
      },
      select: passengerSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'updateOperator' });
    throw error;
  }
};

// Big limit as now we just want to get all operators for one use case
const PAGINATION_LIMIT = 1000;

export interface GetPassengersResponse {
  meta: PaginationMeta;
  results: Passenger[];
}

export const getPassengers = async (input: GetPassengersParams): Promise<GetPassengersResponse> => {
  const { limit, page: requestPage, column, sort } = input;

  const page = requestPage ? requestPage - 1 : 0;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const data = await prisma.$transaction([
    prisma.passenger.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.passenger.findMany({
      where: {
        deletedAt: null,
      },
      skip,
      take,
      select: passengerSelectedFields,
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

export type GetPassengerResponse = Passenger;

export const getPassenger = async (id: string): Promise<GetPassengerResponse> => {
  const passenger = await prisma.passenger.findUnique({
    where: { id },
    select: passengerSelectedFields,
  });

  if (!passenger) {
    logger.error({ error: 'not found', stack: 'getPassenger' });
    throw new Error('not found');
  }

  return passenger;
};

//  soft delete
export const removePassenger = async (id: string): Promise<Passenger> => {
  try {
    return await prisma.passenger.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: passengerSelectedFields,
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

const passengerSelectedFields = {
  id: true,
  name: true,
  phones: true,
  clients: {
    select: {
      id: true,
    },
  },
  createdAt: true,
  deletedAt: true,
};
