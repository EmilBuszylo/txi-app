import { compare, hash } from 'bcrypt';
import { customAlphabet } from 'nanoid';
import slugify from 'slugify';

import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CreateDriverParams,
  GetDriversParams,
  UpdateDriverParams,
} from '@/lib/server/api/endpoints';

import { createToken } from '@/server/auth/auth.service';
import { Driver } from '@/server/drivers/driver';
import { OrderStatus } from '@/server/orders/order';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PhoneNumber = require('awesome-phonenumber');

interface LoginRequest {
  login: string;
  password: string;
}
export const loginDriver = async (input: LoginRequest) => {
  const user = await prisma.user.findUnique({
    where: {
      login: input.login,
      role: 'DRIVER',
    },
    select: {
      id: true,
      login: true,
      firstName: true,
      lastName: true,
      password: true,
      driverDetails: true,
    },
  });

  if (!user) {
    const notFoundException = JSON.stringify({
      code: 404,
      message: 'Not found',
      type: 'notFoundException',
    });
    throw new Error(notFoundException);
  }

  if (!user || !(await compare(input.password, user.password))) {
    const invalidCredentialsException = JSON.stringify({
      code: 401,
      message: 'Invalid credentials',
      type: 'invalidCredentialsException',
    });
    throw new Error(invalidCredentialsException);
  }

  const accessToken = createToken({ login: user.login, id: user.id });

  return {
    ...user,
    password: undefined,
    accessToken,
  };
};

export const createDriver = async (input: CreateDriverParams): Promise<Driver> => {
  const { operatorId, password, phone } = input;
  try {
    const hashed_password = await hash(password, 12);

    let phoneNumber = phone ? PhoneNumber.parsePhoneNumber(phone) : undefined;

    if (typeof phone !== 'undefined' && !phoneNumber.valid) {
      logger.warn({
        error: `wrong format of phone number ${phone}`,
        stack: 'createDriver',
      });
      phoneNumber = undefined;
    }

    return await prisma.user.create({
      data: {
        login: generateDriverLogin(input.firstName, input.lastName),
        firstName: input.firstName,
        lastName: input.lastName,
        phone: phoneNumber?.number.e164,
        password: hashed_password,
        role: 'DRIVER',
        operator: operatorId
          ? {
              connect: {
                id: operatorId,
              },
            }
          : undefined,
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
  const { operatorId, phone, password } = input;
  let phoneNumber = phone ? PhoneNumber.parsePhoneNumber(phone) : undefined;

  if (typeof phoneNumber !== 'undefined' && !phoneNumber.valid) {
    logger.warn({
      error: `wrong format of phone number ${phone}`,
      stack: 'createDriver',
    });
    phoneNumber = undefined;
  }

  const hashed_password = !password || password === '' ? undefined : await hash(password, 12);

  try {
    return await prisma.user.update({
      where: {
        id,
        role: 'DRIVER',
      },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: phoneNumber?.number.e164,
        password: hashed_password,
        operator: operatorId
          ? {
              connect: {
                id: operatorId,
              },
            }
          : undefined,
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

export const getDrivers = async (input: GetDriversParams): Promise<GetDriversResponse> => {
  const { limit, page: requestPage, deletedAt, column, sort } = input;

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
        deletedAt: deletedAt ? { not: null } : null,
      },
      skip,
      take,
      select: driverSelectedFields,
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

export interface GetDriverOrdersInput {
  driverId: string;
  acceptedByDriver?: boolean;
  page: number;
  limit: number;
  completedAtFrom?: string;
  completedAtTo?: string;
  column?: string;
  sort?: 'asc' | 'desc';
  statuses?: OrderStatus[];
}

export const getDriverOrders = async (input: GetDriverOrdersInput) => {
  const {
    driverId,
    limit,
    page: currentPage,
    completedAtFrom,
    statuses,
    acceptedByDriver,
    // column,
    // sort,
    completedAtTo,
  } = input;

  const page = currentPage - 1;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const filters = _getDriverOrdersWhereFilterByParams({ completedAtFrom, completedAtTo, statuses });

  const acceptedByDriverFilter =
    typeof acceptedByDriver === 'boolean'
      ? {
          acceptedByDriver,
        }
      : {
          OR: [
            {
              acceptedByDriver: true,
            },
            {
              acceptedByDriver: null,
            },
          ],
        };

  const data = await prisma.$transaction([
    prisma.order.count({
      where: {
        deletedAt: null,
        driverId,
        ...filters,
        ...acceptedByDriverFilter,
      },
    }),
    prisma.order.findMany({
      where: {
        deletedAt: null,
        driverId,
        ...filters,
        ...acceptedByDriverFilter,
      },
      skip: skip,
      take: take,
      select: driverOrderFields,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      orderBy: {
        shipmentToDriverAt: 'desc',
      },
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage, itemCount: data[0], take }),
    results: data[1],
  };
};

interface UpdateDriverOrderInput {
  orderId: string;
  driverId: string;
  status?: OrderStatus;
  acceptedByDriver?: boolean;
  stopTime?: number;
  actualKm?: number;
}

export const getDriverOrderDetails = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: driverOrderDetailsFields,
  });

  if (!order) {
    logger.error({ error: 'not found', stack: 'getDriverOrder' });
    throw new Error('not found');
  }

  return order;
};

export const updateDriverOrder = async (input: UpdateDriverOrderInput) => {
  const { driverId, orderId, ...rest } = input;

  let completedAt;
  if (rest.status === OrderStatus.COMPLETED) {
    completedAt = new Date();
  }

  return prisma.order.update({
    where: {
      id: orderId,
      driverId: driverId,
    },
    data: {
      ...rest,
      completedAt,
    },
    select: driverOrderDetailsFields,
  });
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

const _getSortByParams = ({ column, sort }: Pick<GetDriversParams, 'column' | 'sort'>) => {
  if (!column || !sort) {
    return {
      createdAt: 'desc',
    };
  }

  return {
    [column]: sort,
  };
};

type ParamsFilter = {
  [key: string]: string | boolean | undefined | string[];
};

type WhereFilter = {
  // @-ts-ignore
  [key: string]: unknown;
};

const _getDriverOrdersWhereFilterByParams = ({
  completedAtFrom,
  completedAtTo,
  statuses,
}: ParamsFilter): WhereFilter => {
  return {
    ...(completedAtFrom || completedAtTo
      ? {
          completedAt: {
            lte: completedAtTo ? new Date(completedAtTo as string).toISOString() : undefined, // "2022-01-30T00:00:00.000Z"
            gte: completedAtFrom ? new Date(completedAtFrom as string).toISOString() : undefined, // "2022-01-15T00:00:00.000Z"
          },
        }
      : undefined),
    ...(statuses && {
      status: {
        in: statuses,
      },
    }),
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

const driverSelectedFields = {
  id: true,
  login: true,
  firstName: true,
  lastName: true,
  phone: true,
  operatorId: true,
  operatorName: true,
  createdAt: true,
  deletedAt: true,
  driverDetails: {
    select: {
      carModel: true,
      carBrand: true,
      carColor: true,
      carRegistrationNumber: true,
    },
  },
};

const driverOrderFields = {
  id: true,
  internalId: true,
  locationFrom: true,
  locationTo: true,
  locationVia: true,
  comment: true,
  estimatedDistance: true,
  acceptedByDriver: true,
  shipmentToDriverAt: true,
  completedAt: true,
  status: true,
  stopTime: true,
  kmForDriver: true,
  clientName: true,
  updatedAt: true,
  createdAt: true,
};

const driverOrderDetailsFields = {
  ...driverOrderFields,
  highwaysCost: true,
  operatorNote: true,
  routeMap: true,
  driver: {
    select: {
      id: true,
    },
  },
};
