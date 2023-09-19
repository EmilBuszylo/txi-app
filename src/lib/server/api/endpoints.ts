import { parsePhoneNumber } from 'awesome-phonenumber';

import fetchJson from '@/lib/helpers/fetch-json';
import z from '@/lib/helpers/zod/zod';

import { SITE_URL } from '@/constant/env';
import { ApiRoutes } from '@/constant/routes';
import { ValidationPattern } from '@/constant/validation';
import { GetClientsResponse } from '@/server/clients/clients.service';
import { GetCollectionPointsResponse } from '@/server/collection-points.ts/collection-points.service';
import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';
import { Driver } from '@/server/drivers/driver';
import { GetDriversResponse } from '@/server/drivers/drivers.service';
import { GetOperatorsResponse } from '@/server/operators/operators.service';
import {
  LocationFrom,
  locationFromSchema,
  LocationTo,
  locationToSchema,
  Order,
  OrderStatus,
} from '@/server/orders/order';
import { GetOrdersResponse } from '@/server/orders/orders.service';

function getNextApiPath(path: string): string {
  return SITE_URL + 'api' + path;
}

export interface GetOrdersParams {
  page: number;
  limit: number;
  noLimit?: boolean;
  status?: OrderStatus;
  clientName?: string;
  clientId?: string;
  driverId?: string;
  hasActualKm?: boolean;
  clientInvoice?: string;
  hasClientInvoice?: boolean;
  createdAtFrom?: string;
  createdAtTo?: string;
  column?: string;
  sort?: 'asc' | 'desc';
}

export function getOrders({
  page,
  limit,
  noLimit,
  status,
  clientName,
  clientId,
  driverId,
  hasActualKm,
  clientInvoice,
  hasClientInvoice,
  createdAtFrom,
  createdAtTo,
  column,
  sort,
}: GetOrdersParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    noLimit: noLimit ? noLimit.toString() : '',
    status: status || '',
    clientName: clientName || '',
    clientId: clientId || '',
    driverId: driverId || '',
    hasActualKm: hasActualKm ? hasActualKm.toString() : '',
    clientInvoice: clientInvoice || '',
    hasClientInvoice: hasClientInvoice ? hasClientInvoice.toString() : '',
    createdAtFrom: createdAtFrom || '',
    createdAtTo: createdAtTo || '',
    column: column || '',
    sort: sort || '',
  });
  return fetchJson<GetOrdersResponse>(
    getNextApiPath(ApiRoutes.ORDERS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

export const createOrderSchema = z.object({
  locationFrom: locationFromSchema.extend({
    date: z
      .string()
      .optional()
      .refine(
        (data) => {
          if (!data) {
            return true;
          }

          return new Date(data) > new Date();
        },
        { message: 'Wybrana data nie może być z przeszłości' }
      ),
  }),
  locationTo: locationToSchema.extend({
    date: z
      .string()
      .optional()
      .refine(
        (data) => {
          if (!data) {
            return true;
          }

          return new Date(data) > new Date();
        },
        { message: 'Wybrana data nie może być z przeszłości' }
      ),
  }),
  locationVia: z.array(
    locationFromSchema.extend({
      date: z
        .string()
        .optional()
        .refine(
          (data) => {
            if (!data) {
              return true;
            }

            return new Date(data) > new Date();
          },
          { message: 'Wybrana data nie może być z przeszłości' }
        ),
    })
  ),
  externalId: z.string().nonempty(),
  comment: z.string().optional(),
  clientId: z.string().optional(),
  driverId: z.string().optional(),
  collectionPointId: z.string().optional(),
  collectionPointsGeoCodes: z
    .object({
      lng: z.string(),
      lat: z.string(),
    })
    .optional(),
});

export type CreateOrderParams = z.infer<typeof createOrderSchema>;

export function createOrder(params: CreateOrderParams) {
  return fetchJson<Order>(getNextApiPath(ApiRoutes.ORDERS), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export const updateOrderSchema = z.object({
  clientId: z.string().optional(),
  locationFrom: locationFromSchema,
  locationTo: locationToSchema,
  locationVia: z.array(locationFromSchema.optional()),
  externalId: z.string().optional(),
  status: z.string().optional(),
  comment: z.string().optional().nullable(),
  clientInvoice: z.string().optional().nullable(),
  driverInvoice: z.string().optional().nullable(),
  isPayed: z.boolean().optional().nullable(),
  kmForDriver: z.any().optional().nullable(),
  actualKm: z.any().optional().nullable(),
  driverId: z.string().optional(),
  highwaysCost: z.string().optional(),
  collectionPointId: z.string().optional(),
  collectionPointsGeoCodes: z
    .object({
      lng: z.string(),
      lat: z.string(),
    })
    .optional(),
  stopTime: z.any().optional().nullable(),
});

export interface UpdateOrderParams extends Pick<CreateOrderParams, 'collectionPointsGeoCodes'> {
  driverId?: string;
  clientId?: string;
  collectionPointId?: string;
  isPayed?: boolean;
  comment?: string;
  status?: OrderStatus;
  clientInvoice?: string;
  driverInvoice?: string;
  withPassenger?: boolean;
  actualKm?: number;
  kmForDriver?: number;
  externalId?: string;
  locationFrom?: LocationFrom;
  locationVia?: LocationFrom[];
  locationTo?: LocationTo;
  highwaysCost?: string;
  isKmDifferenceAccepted?: boolean;
  stopTime?: number;
}

export function updateOrder(id: string, params: UpdateOrderParams) {
  return fetchJson<Order>(getNextApiPath(`${ApiRoutes.ORDERS}/${id}`), {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export interface UpdateManyOrdersParams
  extends Omit<
    UpdateOrderParams,
    | 'locationFrom'
    | 'locationTo'
    | 'locationVia'
    | 'collectionPointId'
    | 'collectionPointsGeoCodes'
    | 'clientId'
    | 'externalId'
    | 'highwaysCost'
    | 'stopTime'
  > {
  ids: string[];
}
export function updateManyOrders(params: UpdateManyOrdersParams) {
  return fetchJson<Order[]>(getNextApiPath(`${ApiRoutes.ORDERS}`), {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export function getOrder(id: string) {
  return fetchJson<Order>(getNextApiPath(`${ApiRoutes.ORDERS}/${id}`), {
    method: 'GET',
  });
}

export function removeOrder(id: string) {
  return fetchJson<Order>(getNextApiPath(`${ApiRoutes.ORDERS}/${id}`), {
    method: 'DELETE',
  });
}

export const calculateLocationsDistanceSchema = z.object({
  locationFrom: locationFromSchema.optional(),
  locationTo: locationToSchema.optional(),
  locationVia: z.array(locationFromSchema.optional()).optional(),
  collectionPointsGeoCodes: z
    .object({
      lng: z.string(),
      lat: z.string(),
    })
    .optional(),
});
export type CalculateLocationsDistanceParams = z.infer<typeof calculateLocationsDistanceSchema>;

export interface CalculateLocationsDistanceResponse {
  estimatedDistance?: {
    distance: number;
    hasHighway?: boolean;
  };
  wayBackDistance?: {
    distance: number;
    hasHighway?: boolean;
  };
}

export function calculateLocationsDistance(params: CalculateLocationsDistanceParams) {
  return fetchJson<CalculateLocationsDistanceResponse>(
    getNextApiPath(`${ApiRoutes.ORDERS}/distance`),
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );
}

// Driver endpoints start

export interface GetDriversParams {
  page: number;
  limit: number;
}

export function getDrivers({ page, limit }: GetDriversParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  return fetchJson<GetDriversResponse>(
    getNextApiPath(ApiRoutes.DRIVERS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

export function getDriver(id: string) {
  return fetchJson<Driver>(getNextApiPath(`${ApiRoutes.DRIVERS}/${id}`), {
    method: 'GET',
  });
}

export const createDriverSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  operatorId: z.string().optional().nullable(),
  phone: z.string().refine(
    (phone) => {
      const pn = parsePhoneNumber(phone);

      return pn.valid;
    },
    {
      message: 'Numer telefonu ma nieprawidłowy format',
    }
  ),
  password: z.string().regex(ValidationPattern.PASSWORD_VALIDATION),
  car: z
    .object({
      carModel: z.string(),
      carBrand: z.string(),
      carColor: z.string().optional(),
      carRegistrationNumber: z.string(),
    })
    .optional(),
});

export type CreateDriverParams = z.infer<typeof createDriverSchema>;

export function createDriver(params: CreateDriverParams) {
  return fetchJson<Driver>(getNextApiPath(ApiRoutes.DRIVERS), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export const updateDriverSchema = z.object({
  login: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  operatorId: z.string().optional().nullable(),
  phone: z.string().refine(
    (phone) => {
      const pn = parsePhoneNumber(phone);

      return pn.valid;
    },
    {
      message: 'Numer telefonu ma nieprawidłowy format',
    }
  ),
  password: z.string().optional(),
  car: z
    .object({
      carModel: z.string(),
      carBrand: z.string(),
      carColor: z.string().optional(),
      carRegistrationNumber: z.string(),
    })
    .optional(),
});

export type UpdateDriverParams = Omit<z.infer<typeof updateDriverSchema>, 'password'>;

export function updateDriver(id: string, params: UpdateDriverParams) {
  return fetchJson<Driver>(getNextApiPath(`${ApiRoutes.DRIVERS}/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export function removeDriver(id: string) {
  return fetchJson<Driver>(getNextApiPath(`${ApiRoutes.DRIVERS}/${id}`), {
    method: 'DELETE',
  });
}

// Collection point endpoints
export interface GetCollectionPointsParams {
  page: number;
  limit: number;
}

export function getCollectionPoints({ page, limit }: GetCollectionPointsParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return fetchJson<GetCollectionPointsResponse>(
    getNextApiPath(ApiRoutes.COLLECTION_POINTS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

export function getCollectionPoint(id: string) {
  return fetchJson<CollectionPoint>(getNextApiPath(`${ApiRoutes.COLLECTION_POINTS}/${id}`), {
    method: 'GET',
  });
}

export const createCollectionPointSchema = z.object({
  name: z.string(),
  fullAddress: z.string(),
  city: z.string(),
  lat: z.string(),
  lng: z.string(),
  url: z.string(),
});

export type CreateCollectionPointParams = z.infer<typeof createCollectionPointSchema>;

export function createCollectionPoint(params: CreateCollectionPointParams) {
  return fetchJson<CollectionPoint>(getNextApiPath(ApiRoutes.COLLECTION_POINTS), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function updateCollectionPoint(id: string, params: CreateCollectionPointParams) {
  return fetchJson<CollectionPoint>(getNextApiPath(`${ApiRoutes.COLLECTION_POINTS}/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export function removeCollectionPoint(id: string) {
  return fetchJson<CollectionPoint>(getNextApiPath(`${ApiRoutes.COLLECTION_POINTS}/${id}`), {
    method: 'DELETE',
  });
}

// Clients endpoints

export interface GetClientsParams {
  page: number;
  limit: number;
}

export function getClients({ page, limit }: GetClientsParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return fetchJson<GetClientsResponse>(
    getNextApiPath(ApiRoutes.CLIENTS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

// Operators endpoints

export const createOperatorSchema = z.object({
  name: z.string(),
});

export type CreateOperatorParams = z.infer<typeof createOperatorSchema>;

export function createOperator(params: CreateOperatorParams) {
  return fetchJson<Driver>(getNextApiPath(ApiRoutes.OPERATORS), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export interface GetOperatorsParams {
  page: number;
  limit: number;
}

export function getOperators({ page, limit }: GetOperatorsParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  return fetchJson<GetOperatorsResponse>(
    getNextApiPath(ApiRoutes.OPERATORS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

// emails
export interface SendEmailRequest {
  subject?: string;
  orderData: {
    id: string;
    internalId: string;
    clientName: string;
  };
}

export function sendNewOrderEmail(params: SendEmailRequest) {
  return fetchJson<{ success: boolean }>(getNextApiPath(ApiRoutes.EMAIL), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
