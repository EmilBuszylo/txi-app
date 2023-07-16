import { hash } from 'bcrypt';
import { customAlphabet } from 'nanoid';
import slugify from 'slugify';

import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import { CreateDriverParams, GetOrdersParams } from '@/lib/server/api/endpoints';

import { Driver } from '@/server/drivers/driver';

export const createDriver = async (input: CreateDriverParams): Promise<Driver> => {
  try {
    const hashed_password = await hash(input.password, 12);

    return await prisma.user.create({
      data: {
        login: generateDriverLogin(input.firstName, input.lastName),
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        password: hashed_password,
        role: 'DRIVER',
      },
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        phone: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const PAGINATION_LIMIT = 20;

export interface GetDriversResponse {
  meta: PaginationMeta;
  results: Driver[];
}

export const getDrivers = async (input: GetOrdersParams): Promise<GetDriversResponse> => {
  const { limit, page: requestPage } = input;

  const page = requestPage ? requestPage - 1 : 0;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const data = await prisma.$transaction([
    prisma.user.count({
      where: {
        role: 'DRIVER',
      },
    }),
    prisma.user.findMany({
      where: {
        role: 'DRIVER',
      },
      skip,
      take,
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
        phone: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage: requestPage, itemCount: data[0], take }),
    results: data[1],
  };
};

const generateDriverLogin = (firstName: string, lastName: string) => {
  const nanoid = customAlphabet('123456789abcdefghijklmnoprstuwxyz', 10);

  const slug = slugify(`${firstName.slice(0, 5)}-${lastName.slice(0, 5)}`, {
    remove: /[*+~.,()'"!:;@]/g,
    lower: true,
  });

  return `${slug}-${nanoid(5)}`.toLowerCase();
};
