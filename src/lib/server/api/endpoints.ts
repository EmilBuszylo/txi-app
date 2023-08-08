import { parsePhoneNumber } from 'awesome-phonenumber';
import { z } from 'zod';

import fetchJson from '@/lib/helpers/fetch-json';

import { SITE_URL } from '@/constant/env';
import { ApiRoutes } from '@/constant/routes';
import { ValidationPattern } from '@/constant/validation';
import { GetClientsResponse } from '@/server/clients/clients.service';
import { GetCollectionPointsResponse } from '@/server/collection-points.ts/collection-points.service';
import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';
import { Driver } from '@/server/drivers/driver';
import { GetDriversResponse } from '@/server/drivers/drivers.service';
import {
  LocationFrom,
  locationFromSchema,
  LocationTo,
  locationToSchema,
  Order,
} from '@/server/orders/order';
import { GetOrdersResponse } from '@/server/orders/orders.service';

function getNextApiPath(path: string): string {
  return SITE_URL + '/api' + path;
}

export interface GetOrdersParams {
  page: number;
  limit: number;
}

export function getOrders({ page, limit }: GetOrdersParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  return fetchJson<GetOrdersResponse>(
    getNextApiPath(ApiRoutes.ORDERS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

export const createOrderSchema = z.object({
  locationFrom: locationFromSchema,
  locationTo: locationToSchema,
  locationVia: z.array(locationFromSchema.optional()),
  externalId: z.string(),
  comment: z.string().optional(),
  // withPassenger: z.boolean().optional(),
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
  clientId: z.string(),
  locationFrom: locationFromSchema,
  locationTo: locationToSchema,
  locationVia: z.array(locationFromSchema.optional()),
  externalId: z.string(),
  comment: z.string().optional(),
  clientInvoice: z.string().optional(),
  driverInvoice: z.string().optional(),
  isPayed: z.boolean().optional(),
  kmForDriver: z.number().optional(),
  actualKm: z.number().optional(),
  // withPassenger: z.boolean().optional(),
  driverId: z.string().optional(),
  collectionPointId: z.string().optional(),
  collectionPointsGeoCodes: z
    .object({
      lng: z.string(),
      lat: z.string(),
    })
    .optional(),
});

export interface UpdateOrderParams extends Pick<CreateOrderParams, 'collectionPointsGeoCodes'> {
  driverId?: string;
  clientId: string;
  collectionPointId?: string;
  isPayed?: boolean;
  comment?: string;
  clientInvoice?: string;
  driverInvoice?: string;
  withPassenger?: boolean;
  actualKm?: number;
  kmForDriver?: number;
  externalId: string;
  locationFrom: LocationFrom;
  locationVia?: LocationFrom[];
  locationTo: LocationTo;
}

export function updateOrder(id: string, params: UpdateOrderParams) {
  return fetchJson<Driver>(getNextApiPath(`${ApiRoutes.ORDERS}/${id}`), {
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
