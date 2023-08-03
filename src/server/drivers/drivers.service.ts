// eslint-disable-next-line @typescript-eslint/no-var-requires
const PhoneNumber = require('awesome-phonenumber');
import { hash } from 'bcrypt';
import { customAlphabet } from 'nanoid';
import slugify from 'slugify';

import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CreateDriverParams,
  GetOrdersParams,
  UpdateDriverParams,
} from '@/lib/server/api/endpoints';

import { Driver } from '@/server/drivers/driver';

export const createDriver = async (input: CreateDriverParams): Promise<Driver> => {
  try {
    const hashed_password = await hash(input.password, 12);

    let phone = input?.phone ? PhoneNumber.parsePhoneNumber(input.phone) : undefined;

    if (typeof phone !== 'undefined' && !phone.valid) {
      logger.warn({
        error: `wrong format of phone number ${input.phone}`,
        stack: 'createDriver',
      });
      phone = undefined;
    }

    return await prisma.user.create({
      data: {
        login: generateDriverLogin(input.firstName, input.lastName),
        firstName: input.firstName,
        lastName: input.lastName,
        phone: phone?.number.e164,
        password: hashed_password,
        role: 'DRIVER',
        driverDetails: {
          create: {
            ...input.car,
          },
        },
      },
      select: driverSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'createDriver' });
    throw error;
  }
};

export const updateDriver = async (id: string, input: UpdateDriverParams): Promise<Driver> => {
  let phone = input?.phone ? PhoneNumber.parsePhoneNumber(input.phone) : undefined;

  if (typeof phone !== 'undefined' && !phone.valid) {
    logger.warn({
      error: `wrong format of phone number ${input.phone}`,
      stack: 'createDriver',
    });
    phone = undefined;
  }

  try {
    return await prisma.user.update({
      where: {
        id,
        role: 'DRIVER',
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: phone?.number.e164,
        driverDetails: {
          update: {
            ...input.car,
          },
        },
      },
      select: driverSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'updateDriver' });
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
        deletedAt: null,
      },
    }),
    prisma.user.findMany({
      where: {
        role: 'DRIVER',
        deletedAt: null,
      },
      skip,
      take,
      select: driverSelectedFields,
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage: requestPage, itemCount: data[0], take }),
    results: data[1],
  };
};

export const getDriver = async (id: string): Promise<Driver> => {
  const driver = await prisma.user.findUnique({
    where: { id, role: 'DRIVER' },
    select: driverSelectedFields,
  });

  if (!driver) {
    logger.error({ error: 'not found', stack: 'getDriver' });
    throw new Error('not found');
  }

  return driver;
};

//  soft delete
export const removeDriver = async (id: string): Promise<Driver> => {
  try {
    return await prisma.user.update({
      where: { id, role: 'DRIVER' },
      data: {
        deletedAt: new Date(),
      },
      select: driverSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'removeDriver' });
    throw error;
  }
};

const generateDriverLogin = (firstName: string, lastName: string) => {
  const nanoid = customAlphabet('123456789abcdefghijklmnoprstuwxyz', 10);

  const slug = slugify(`${firstName.slice(0, 5)}-${lastName.slice(0, 5)}`, {
    remove: /[*+~.,()'"!:;@]/g,
    lower: true,
  });

  return `${slug}-${nanoid(5)}`.toLowerCase();
};

const driverSelectedFields = {
  id: true,
  login: true,
  firstName: true,
  lastName: true,
  phone: true,
  createdAt: true,
  driverDetails: {
    select: {
      carModel: true,
      carBrand: true,
      carColor: true,
      carRegistrationNumber: true,
    },
  },
};
