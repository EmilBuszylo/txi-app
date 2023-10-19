import { addDays, format, subMinutes } from 'date-fns';
import { z } from 'zod';

import { calculateDistance, Waypoint } from '@/lib/helpers/distance';
import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CalculateLocationsDistanceParams,
  CalculateLocationsDistanceResponse,
  CreateOrderParams,
  GetOrdersParams,
  UpdateManyOrdersParams,
  UpdateOrderParams,
} from '@/lib/server/api/endpoints';

import { sendEmail } from '@/server/email/email.service';
import { getNewOrderTemplate } from '@/server/email/templates/new-order-template';
import {
  LocationFrom,
  locationFromSchema,
  LocationTo,
  locationToSchema,
  locationViaPointSchema,
  Order,
  OrderStatus,
} from '@/server/orders/order';

export const calculateLocationsDistance = async (
  input: CalculateLocationsDistanceParams
): Promise<CalculateLocationsDistanceResponse> => {
  const viaWaypoints = input.locationVia
    ?.map((loc) => ({
      lat: loc?.address.lat,
      lng: loc?.address.lng,
    }))
    .filter((loc) => typeof loc.lat === 'string' && typeof loc.lng === 'string');

  const { estimatedDistance, wayBackDistance } = await _calculateOrderDistancesData({
    collectionPointsGeoCodes: input.collectionPointsGeoCodes,
    locationFrom: input.locationFrom,
    locationTo: input.locationTo,
    viaWaypoints: viaWaypoints as Waypoint[],
  });

  return {
    estimatedDistance,
    wayBackDistance,
  };
};

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
    await z.array(locationViaPointSchema.optional()).optional().parseAsync(locationVia);

    const viaWaypoints = locationVia
      .map((loc) => ({
        lat: loc?.address.lat,
        lng: loc?.address.lng,
      }))
      .filter((loc) => typeof loc.lat === 'string' && typeof loc.lng === 'string');

    const { estimatedDistance, wayBackDistance, intakeDistance } =
      await _calculateOrderDistancesData({
        collectionPointsGeoCodes,
        locationFrom,
        locationTo,
        viaWaypoints: viaWaypoints as Waypoint[],
      });

    const currentDayDate = new Date().setHours(0, 0, 0, 0);

    const nextDay = subMinutes(addDays(currentDayDate, 1), 1);

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(currentDayDate),
          lte: nextDay,
        },
      },
    });

    logger.info({
      currentDayDate,
      nextDay,
      nowDate: new Date().toISOString(),
      count,
      stack: 'createOrder',
      event: 'order id info',
    });

    const status = input.driverId ? OrderStatus.STARTED : OrderStatus.NEW;

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          internalId: _createInternalId(count + 1),
          ...rest,
          locationFrom,
          locationTo,
          intakeDistance: intakeDistance,
          estimatedDistance: estimatedDistance?.distance,
          hasHighway: estimatedDistance?.hasHighway,
          locationVia: locationVia as unknown as string,
          wayBackDistance: wayBackDistance?.distance,
          status,
          client: {
            connect: {
              id: clientId,
            },
          },
          driver: {
            connect: driverId
              ? {
                  id: driverId,
                }
              : undefined,
          },
          collectionPoint: {
            connect: collectionPointId
              ? {
                  id: collectionPointId,
                }
              : undefined,
          },
        },
      });

      if (order) {
        const dispatchers = await tx.user.findMany({
          where: {
            role: 'DISPATCHER',
            email: {
              not: null,
            },
          },
          select: {
            email: true,
          },
        });

        await sendEmail({
          subject: `Nowe zlecenie ${order.internalId} ${order.clientName}`,
          orderData: {
            id: order.id,
            internalId: order.internalId,
            clientName: order.clientName,
          },
          to: dispatchers.map((d) => d.email) as string[],
          template: getNewOrderTemplate(order as unknown as Order),
        });
      }

      return order;
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
    await z.array(locationViaPointSchema.optional()).optional().parseAsync(locationVia);

    const viaWaypoints = locationVia
      ?.map((loc) => ({
        lat: loc?.address.lat,
        lng: loc?.address.lng,
      }))
      .filter((loc) => typeof loc.lat === 'string' && typeof loc.lng === 'string');

    let collectionPointsGeoCodesData = collectionPointsGeoCodes;
    if (!collectionPointsGeoCodesData && collectionPointId) {
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

    const { estimatedDistance, wayBackDistance, intakeDistance } =
      await _calculateOrderDistancesData({
        collectionPointsGeoCodes: collectionPointsGeoCodesData,
        locationFrom,
        locationTo,
        viaWaypoints: viaWaypoints as Waypoint[],
      });

    const status =
      input.driverId && input.status === OrderStatus.NEW ? OrderStatus.STARTED : input.status;

    return prisma.order.update({
      where: {
        id,
      },
      data: {
        locationFrom,
        locationTo,
        intakeDistance: intakeDistance,
        estimatedDistance: estimatedDistance?.distance,
        hasHighway: estimatedDistance?.hasHighway,
        locationVia: locationVia as unknown as string,
        wayBackDistance: wayBackDistance?.distance,
        ...rest,
        status,
        driver: driverId
          ? {
              connect: {
                id: driverId,
              },
            }
          : undefined,
        client: clientId
          ? {
              connect: {
                id: clientId,
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

const PAGINATION_LIMIT = 50;

export interface GetOrdersResponse {
  meta: PaginationMeta;
  results: Order[];
}

export const getOrders = async (input: GetOrdersParams) => {
  const {
    limit,
    noLimit,
    page: currentPage,
    status,
    clientName,
    clientId,
    driverId,
    hasActualKm,
    clientInvoice,
    hasClientInvoice,
    createdAtFrom,
    column,
    sort,
    createdAtTo,
    operatorId,
  } = input;

  const page = currentPage - 1;
  const take = limit || PAGINATION_LIMIT;
  const skip = page * take;

  const filters = _getWhereFilterByParams({
    status,
    clientName,
    clientId,
    driverId,
    hasActualKm,
    clientInvoice,
    hasClientInvoice,
    createdAtFrom,
    createdAtTo,
    operatorId,
  });

  const data = await prisma.$transaction([
    prisma.order.count({
      where: {
        deletedAt: null,
        ...filters,
        collectionPoint: {},
      },
    }),
    prisma.order.findMany({
      where: {
        deletedAt: null,
        ...filters,
      },
      skip: noLimit ? undefined : skip,
      take: noLimit ? undefined : take,
      select: orderSelectedFields,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      orderBy: _getSortByParams({ column, sort }),
    }),
  ]);

  return {
    meta: getPaginationMeta({ currentPage, itemCount: data[0], take }),
    results: data[1],
  };
};

const _getSortByParams = ({ column, sort }: Pick<GetOrdersParams, 'column' | 'sort'>) => {
  if (!column || !sort) {
    return {
      createdAt: 'desc',
    };
  }

  return {
    [column]: sort,
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
  return `TXI/${format(new Date(), 'yyyyLLdd')}/${count}`;
};

const _calculateOrderDistancesData = async ({
  collectionPointsGeoCodes,
  locationFrom,
  viaWaypoints,
  locationTo,
}: CalculateOrderDistancesDataProps) => {
  const withLocationFrom = locationFrom?.address.lng && locationFrom.address.lat;
  const withLocationTo = locationTo?.address.lng && locationTo.address.lat;

  const estimatedDistance = await calculateDistance(
    [
      collectionPointsGeoCodes,
      withLocationFrom
        ? {
            lat: locationFrom.address.lat,
            lng: locationFrom.address.lng,
          }
        : undefined,
      ...(viaWaypoints as Waypoint[]),
      withLocationTo
        ? {
            lat: locationTo.address.lat,
            lng: locationTo.address.lng,
          }
        : undefined,
    ],
    true
  );

  const wayBackDistance = await calculateDistance(
    [
      withLocationTo
        ? {
            lat: locationTo.address.lat,
            lng: locationTo.address.lng,
          }
        : undefined,
      collectionPointsGeoCodes,
    ],
    false
  );

  let intakeDistance: number | undefined = undefined;

  if (withLocationFrom && collectionPointsGeoCodes) {
    const distanceBetweenCollectionPointAndStart = await calculateDistance(
      [
        collectionPointsGeoCodes,
        {
          lat: locationFrom.address.lat,
          lng: locationFrom.address.lng,
        },
      ],
      false
    );

    intakeDistance = distanceBetweenCollectionPointAndStart?.distance
      ? distanceBetweenCollectionPointAndStart.distance
      : undefined;
  }

  return {
    estimatedDistance,
    wayBackDistance,
    intakeDistance,
  };
};

type ParamsFilter = {
  [key: string]: string | boolean | undefined;
};

type WhereFilter = {
  // @-ts-ignore
  [key: string]: unknown;
};

const _getWhereFilterByParams = ({
  status,
  clientName,
  clientId,
  driverId,
  hasActualKm,
  clientInvoice,
  hasClientInvoice,
  createdAtFrom,
  createdAtTo,
  operatorId,
}: ParamsFilter): WhereFilter => {
  return {
    ...(status && { status }),
    ...(clientName && { clientName }),
    ...(clientId && { clientId }),
    ...(driverId && { driverId }),
    ...(typeof hasActualKm === 'boolean' && {
      actualKm: hasActualKm
        ? {
            not: null,
          }
        : null,
    }),
    ...(clientInvoice && { clientInvoice: { contains: clientInvoice, mode: 'insensitive' } }),
    ...(typeof hasClientInvoice === 'boolean' && {
      clientInvoice: hasClientInvoice ? { not: null } : null,
    }),
    ...(createdAtFrom || createdAtTo
      ? {
          createdAt: {
            lte: createdAtTo ? new Date(createdAtTo as string).toISOString() : undefined, // "2022-01-30T00:00:00.000Z"
            gte: createdAtFrom ? new Date(createdAtFrom as string).toISOString() : undefined, // "2022-01-15T00:00:00.000Z"
          },
        }
      : undefined),
    ...(operatorId && {
      driver: {
        operatorId: operatorId,
      },
    }),
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
  kmForDriver: true,
  hasHighway: true,
  status: true,
  actualKm: true,
  clientId: true,
  clientName: true,
  comment: true,
  isKmDifferenceAccepted: true,
  highwaysCost: true,
  intakeDistance: true,
  stopTime: true,
  driver: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phone: true,
      operatorName: true,
    },
  },
  collectionPoint: {
    select: {
      id: true,
      name: true,
      fullAddress: true,
      lng: true,
      lat: true,
    },
  },
  updatedAt: true,
  createdAt: true,
};
