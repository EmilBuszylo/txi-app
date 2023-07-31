import { format } from 'date-fns';
import { z } from 'zod';

import { calculateDistance, Waypoint } from '@/lib/helpers/distance';
import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import { CreateOrderParams, GetOrdersParams } from '@/lib/server/api/endpoints';

import { locationFromSchema, locationToSchema, Order } from '@/server/orders/order';

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

    const estimatedDistance = collectionPointsGeoCodes
      ? await calculateDistance(
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
        )
      : undefined;

    const wayBackDistance = collectionPointsGeoCodes
      ? await calculateDistance(
          [
            {
              lat: locationTo.address.lat,
              lng: locationTo.address.lng,
            },
            collectionPointsGeoCodes,
          ],
          false
        )
      : undefined;

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
    logger.error(error);
    throw error;
  }
};

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

const _createInternalId = (count: number) => {
  return `txi/${format(new Date(), 'yyyy/LL/d')}${count}`;
};

const orderSelectedFields = {
  id: true,
  internalId: true,
  externalId: true,
  locationFrom: true,
  locationVia: true,
  locationTo: true,
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
