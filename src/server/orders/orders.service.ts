import { format } from 'date-fns';
import { z } from 'zod';

import { calculateDistance, Waypoint } from '@/lib/helpers/distance';
import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CreateOrderParams,
  GetOrdersParams,
  UpdateManyOrdersParams,
  UpdateOrderParams,
} from '@/lib/server/api/endpoints';

import {
  LocationFrom,
  locationFromSchema,
  LocationTo,
  locationToSchema,
  Order,
} from '@/server/orders/order';

export const createOrder = async (input: CreateOrderParams) => {
  const {
    clientId,
    driverId,
    collectionPointId,
    collectionPointsGeoCodes,
    locationFrom,
    locationTo,
    locationVia,
    ...rest
  } = input;

  try {
    await locationFromSchema.optional().parseAsync(locationFrom);
    await locationToSchema.optional().parseAsync(locationTo);
    await z.array(locationFromSchema.optional()).optional().parseAsync(locationVia);

    const viaWaypoints = locationVia
      .map((loc) => ({
        lat: loc?.address.lat,
        lng: loc?.address.lng,
      }))
      .filter((loc) => typeof loc.lat === 'string' && typeof loc.lng === 'string');

    //  todo temp log, remember to remove it later
    // eslint-disable-next-line no-console
    console.log([
      collectionPointsGeoCodes,
      {
        lat: locationFrom.address.lat,
        lng: locationFrom.address.lng,
      },
      ...(viaWaypoints as Waypoint[]),
      {
        lat: locationTo.address.lat,
        lng: locationTo.address.lng,
      },
    ]);

    const { estimatedDistance, wayBackDistance } = await _calculateOrderDistancesData({
      collectionPointsGeoCodes,
      locationFrom,
      locationTo,
      viaWaypoints: viaWaypoints as Waypoint[],
    });

    const count = await prisma.order.count();

    return prisma.order.create({
      data: {
        internalId: _createInternalId(count),
        ...rest,
        locationFrom,
        locationTo,
        estimatedDistance: estimatedDistance?.distance,
        hasHighway: estimatedDistance?.hasHighway,
        locationVia: locationVia as unknown as string,
        wayBackDistance: wayBackDistance?.distance,
        status: 'NEW',
        client: {
          connect: {
            id: clientId,
          },
        },
        driver: {
          connect: {
            id: driverId,
          },
        },
        collectionPoint: {
          connect: {
            id: collectionPointId,
          },
        },
      },
    });
  } catch (error) {
    logger.error({ error, stack: 'createOrder' });
    throw error;
  }
};

export const updateManyOrders = async (input: UpdateManyOrdersParams) => {
  const { driverId, ids, ...rest } = input;

  try {
    for (const id of ids) {
      await prisma.order.update({
        where: {
          id,
        },
        data: {
          ...rest,
          driver: driverId
            ? {
                connect: {
                  id: driverId,
                },
              }
            : undefined,
        },
      });
    }

    return prisma.order.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: orderSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'UpdateManyOrders' });
    throw error;
  }
};

export const updateOrder = async (id: string, input: UpdateOrderParams) => {
  const {
    driverId,
    collectionPointId,
    collectionPointsGeoCodes,
    locationFrom,
    locationTo,
    locationVia,
    ...rest
  } = input;

  try {
    await locationFromSchema.optional().parseAsync(locationFrom);
    await locationToSchema.optional().parseAsync(locationTo);
    await z.array(locationFromSchema.optional()).optional().parseAsync(locationVia);

    const viaWaypoints = locationVia
      ?.map((loc) => ({
        lat: loc?.address.lat,
        lng: loc?.address.lng,
      }))
      .filter((loc) => typeof loc.lat === 'string' && typeof loc.lng === 'string');

    let collectionPointsGeoCodesData = collectionPointsGeoCodes;
    if (!collectionPointsGeoCodesData) {
      collectionPointsGeoCodesData = await prisma.collectionPoint.findUniqueOrThrow({
        where: {
          id: collectionPointId,
        },
        select: {
          lat: true,
          lng: true,
        },
      });
    }

    const { estimatedDistance, wayBackDistance } = await _calculateOrderDistancesData({
      collectionPointsGeoCodes: collectionPointsGeoCodesData,
      locationFrom,
      locationTo,
      viaWaypoints: viaWaypoints as Waypoint[],
    });

    return prisma.order.update({
      where: {
        id,
      },
      data: {
        locationFrom,
        locationTo,
        estimatedDistance: estimatedDistance?.distance,
        hasHighway: estimatedDistance?.hasHighway,
        locationVia: locationVia as unknown as string,
        wayBackDistance: wayBackDistance?.distance,
        ...rest,
        driver: driverId
          ? {
              connect: {
                id: driverId,
              },
            }
          : undefined,
        collectionPoint: collectionPointId
          ? {
              connect: {
                id: collectionPointId,
              },
            }
          : undefined,
      },
    });
  } catch (error) {
    logger.error({ error, stack: 'updateOrder' });
    throw error;
  }
};

interface CalculateOrderDistancesDataProps
  extends Pick<CreateOrderParams, 'collectionPointsGeoCodes'> {
  viaWaypoints: Waypoint[];
  locationFrom?: LocationFrom;
  locationTo?: LocationTo;
}

const PAGINATION_LIMIT = 20;

export interface GetOrdersResponse {
  meta: PaginationMeta;
  results: Order[];
}

export const getOrders = async (input: GetOrdersParams) => {
  const { limit, page: currentPage } = input;

  const page = currentPage - 1;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const data = await prisma.$transaction([
    prisma.order.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.order.findMany({
      where: {
        deletedAt: null,
      },
      skip,
      take,
      select: orderSelectedFields,
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

export const getOrder = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: orderSelectedFields,
  });

  if (!order) {
    logger.error({ error: 'not found', stack: 'getOrder' });
    throw new Error('not found');
  }

  return order;
};

//  soft delete
export const removeOrder = async (id: string) => {
  try {
    return await prisma.order.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: orderSelectedFields,
    });
  } catch (error) {
    logger.error({ error, stack: 'removeOrder' });
    throw error;
  }
};

const _createInternalId = (count: number) => {
  return `txi/${format(new Date(), 'yyyy/LL/d')}${count}`;
};

const _calculateOrderDistancesData = async ({
  collectionPointsGeoCodes,
  locationFrom,
  viaWaypoints,
  locationTo,
}: CalculateOrderDistancesDataProps) => {
  if (!collectionPointsGeoCodes || !locationFrom || !locationTo)
    return {
      estimatedDistance: undefined,
      wayBackDistance: undefined,
    };

  const estimatedDistance = await calculateDistance(
    [
      collectionPointsGeoCodes,
      {
        lat: locationFrom.address.lat,
        lng: locationFrom.address.lng,
      },
      ...(viaWaypoints as Waypoint[]),
      {
        lat: locationTo.address.lat,
        lng: locationTo.address.lng,
      },
    ],
    true
  );

  const wayBackDistance = await calculateDistance(
    [
      {
        lat: locationTo.address.lat,
        lng: locationTo.address.lng,
      },
      collectionPointsGeoCodes,
    ],
    false
  );

  return {
    estimatedDistance,
    wayBackDistance,
  };
};

const orderSelectedFields = {
  id: true,
  internalId: true,
  externalId: true,
  locationFrom: true,
  locationVia: true,
  locationTo: true,
  clientInvoice: true,
  driverInvoice: true,
  isPayed: true,
  estimatedDistance: true,
  wayBackDistance: true,
  hasHighway: true,
  status: true,
  clientName: true,
  comment: true,
  driver: {
    select: {
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
  collectionPoint: {
    select: {
      name: true,
      fullAddress: true,
    },
  },
  updatedAt: true,
  createdAt: true,
};
