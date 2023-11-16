import { endOfDay, format, startOfDay } from 'date-fns';
import { z } from 'zod';

import { calculateDistance, Waypoint } from '@/lib/helpers/distance';
import { logger } from '@/lib/logger';
import { getPaginationMeta, PaginationMeta } from '@/lib/pagination';
import { prisma } from '@/lib/prisma';
import {
  CalculateLocationsDistanceParams,
  CalculateLocationsDistanceResponse,
  CancelOrderByClientParams,
  CreateOrderParams,
  GetOrdersParams,
  ResendOrderEmailParams,
  UpdateManyOrdersParams,
  UpdateOrderParams,
} from '@/lib/server/api/endpoints';

import { sendEmail } from '@/server/email/email.service';
import { getCancelOrderTemplate } from '@/server/email/templates/cancel-order-template';
import { getNewOrderTemplate } from '@/server/email/templates/new-order-template';
import { getUpdatedOrderTemplate } from '@/server/email/templates/updated-order-template';
import {
  checkIfStatusChangeIsForbidden,
  LocationFrom,
  locationFromSchema,
  LocationTo,
  locationToSchema,
  locationViaPointSchema,
  Order,
  OrderStatus,
} from '@/server/orders/order';
import { UserRole } from '@/server/users/user';

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

    const currentDayDate = startOfDay(new Date());
    const nextDay = endOfDay(new Date());

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(currentDayDate),
          lte: nextDay,
        },
      },
    });

    const logObj = {
      currentDayDate,
      currentDayAsDate: new Date(currentDayDate),
      currentDayDateIso: new Date(currentDayDate).toISOString(),
      nextDay,
      nowDate: new Date().toISOString(),
      count,
      stack: 'createOrder',
      event: 'order id info',
    };

    logger.warn({ ...logObj, provider: 'custom' });
    // eslint-disable-next-line no-console
    console.log({ ...logObj, provider: 'console' });

    const status = input.driverId ? OrderStatus.STARTED : OrderStatus.NEW;

    let shipmentToDriverAt;
    if (status === OrderStatus.STARTED) {
      shipmentToDriverAt = new Date();
    }

    const order = await prisma.order.create({
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
        shipmentToDriverAt,
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

    const dispatchers = await prisma.user.findMany({
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

    if (order && dispatchers) {
      await sendEmail({
        subject: `Nowe zlecenie ${order.internalId} ${order.clientName}`,
        to: dispatchers.map((d) => d.email) as string[],
        template: getNewOrderTemplate(order as unknown as Order),
      });
    } else {
      logger.warn({
        order,
        dispatchers,
        stack: 'createOrder',
        event: 'email error',
        provider: 'custom',
      });
    }

    return order;
  } catch (error) {
    logger.error({ error, stack: 'createOrder' });
    throw error;
  }
};

const _changeRoleToSettled = async ({
  kmForDriver,
  actualKm,
  id,
  editedBy,
  status,
}: {
  kmForDriver?: Order['kmForDriver'];
  id: string;
  editedBy?: UpdateOrderParams['editedBy'];
  status: Order['status'];
  actualKm?: Order['actualKm'];
}) => {
  if (!status && editedBy?.role && [UserRole.ADMIN].includes(editedBy.role)) {
    if (kmForDriver || actualKm) {
      const oldOrder = await prisma.order.findUnique({
        where: { id },
        select: { status: true, kmForDriver: true, actualKm: true },
      });
      if (
        oldOrder?.status &&
        ![OrderStatus.NEW, OrderStatus.CANCELLED, OrderStatus.SETTLED].includes(
          oldOrder.status as OrderStatus
        ) &&
        (kmForDriver || oldOrder.kmForDriver) &&
        (actualKm || oldOrder.actualKm)
      ) {
        return OrderStatus.SETTLED;
      }
    }
  }

  return status;
};

//  TODO move some action like listing input data saving to the separate method
export const updateManyOrders = async (input: UpdateManyOrdersParams) => {
  const { driverId, editedBy, ids, ...rest } = input;

  const status =
    ids.length === 1
      ? await _changeRoleToSettled({
          id: ids[0],
          kmForDriver: input.kmForDriver,
          actualKm: input.actualKm,
          editedBy: editedBy,
          status: input.status as OrderStatus,
        })
      : undefined;

  try {
    for (const id of ids) {
      await prisma.order.update({
        where: {
          id,
        },
        data: {
          ...rest,
          status,
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

export const cancelOrderByClient = async (input: CancelOrderByClientParams) => {
  if (!input.isClient) {
    throw new Error('forbiddenError');
  }

  const order = await prisma.order.update({
    where: { id: input.id },
    data: { status: 'CANCELLED' },
  });

  if (order) {
    const dispatchers = await prisma.user.findMany({
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
      subject: `Zlecenie ${order.internalId} zostało anulowane przez ${order.clientName}`,
      to: dispatchers.map((d) => d.email) as string[],
      template: getCancelOrderTemplate(order as unknown as Order),
    });
  }

  return order;
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
    //  editedBy is passed only to _changeRoleToSettled, we don't save it to database
    editedBy,
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
      input.driverId && input.status === OrderStatus.NEW
        ? OrderStatus.STARTED
        : await _changeRoleToSettled({
            id,
            kmForDriver: input.kmForDriver,
            actualKm: input.actualKm,
            editedBy,
            status: input.status as OrderStatus,
          });

    await _checkIfStatusChangeIsForbidden(id, {
      status,
      kmForDriver: input.kmForDriver,
      actualKm: input.actualKm,
    });

    let shipmentToDriverAt;
    if (status === OrderStatus.STARTED) {
      shipmentToDriverAt = new Date();
    }

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
        shipmentToDriverAt,
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

export const resendOrderEmail = async (input: ResendOrderEmailParams) => {
  await _prepareOrderEmail({
    subject: input.subject,
    template: getUpdatedOrderTemplate(input.order),
  });

  return {
    status: 'ok',
  };
};

const _prepareOrderEmail = async ({ subject, template }: { subject: string; template: string }) => {
  const dispatchers = await prisma.user.findMany({
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

  if (dispatchers) {
    await sendEmail({
      subject: subject,
      to: dispatchers.map((d) => d.email) as string[],
      template: template,
    });
  } else {
    logger.warn({
      dispatchers,
      stack: 'createOrder',
      event: 'email error',
      provider: 'custom',
    });
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

const _checkIfStatusChangeIsForbidden = async (
  id: string,
  params: { status?: OrderStatus; kmForDriver?: Order['kmForDriver']; actualKm?: Order['actualKm'] }
) => {
  if (!params.status) {
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: { status: true, actualKm: true, kmForDriver: true },
  });

  if (!order) {
    const notFoundException = JSON.stringify({
      code: 404,
      message: 'Not found',
      type: 'notFoundException',
    });
    throw new Error(notFoundException);
  }

  const isStatusChangeForbidden = checkIfStatusChangeIsForbidden({
    providedStatus: params.status,
    currentStatus: order.status as OrderStatus,
    kmForDriver: order.kmForDriver || params?.kmForDriver,
    actualKm: order.actualKm || params?.actualKm,
  });

  if (isStatusChangeForbidden) {
    const methodNotAllowedException = JSON.stringify({
      code: 405,
      message: 'Operation is not allowed',
      type: 'methodNotAllowedException',
    });
    throw new Error(methodNotAllowedException);
  }

  return;
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
  operatorNote: true,
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
      operatorId: true,
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
