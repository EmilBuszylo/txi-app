import { parsePhoneNumber } from 'awesome-phonenumber';

import fetchJson from '@/lib/helpers/fetch-json';
import z from '@/lib/helpers/zod/zod';

import { SITE_URL } from '@/constant/env';
import { ApiRoutes } from '@/constant/routes';
import { ValidationPattern } from '@/constant/validation';
import { GetClientResponse, GetClientsResponse } from '@/server/clients/clients.service';
import { GetCollectionPointsResponse } from '@/server/collection-points.ts/collection-points.service';
import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';
import { Driver } from '@/server/drivers/driver';
import { GetDriversResponse } from '@/server/drivers/drivers.service';
import { Operator } from '@/server/operators/operator';
import { GetOperatorResponse, GetOperatorsResponse } from '@/server/operators/operators.service';
import {
  LocationFrom,
  locationFromSchema,
  LocationTo,
  locationToSchema,
  LocationVia,
  locationViaPointSchema,
  Order,
  OrderStatus,
} from '@/server/orders/order';
import { GetOrdersResponse } from '@/server/orders/orders.service';
import { Passenger } from '@/server/passengers/passenger';
import { GetPassengerResponse, GetPassengersResponse } from '@/server/passengers/passenger.service';
import { UserRole } from '@/server/users/user';

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
  operatorId?: string;
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
  operatorId,
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
    operatorId: operatorId || '',
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
  locationFrom: locationFromSchema,
  locationTo: locationToSchema,
  locationVia: z.array(locationViaPointSchema),
  externalId: z.string().nonempty(),
  comment: z.string().optional(),
  clientId: z.string(),
  driverId: z.string().optional(),
  collectionPointId: z.string().optional(),
  collectionPointsGeoCodes: z
    .object({
      lng: z.string(),
      lat: z.string(),
    })
    .optional(),
});

export const createOrderByClientSchema = createOrderSchema.extend({
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
    locationViaPointSchema.extend({
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
  locationVia: z.array(locationViaPointSchema.optional()),
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
  isKmDifferenceAccepted: z.boolean().nullable().optional(),
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
  locationVia?: LocationVia[];
  locationTo?: LocationTo;
  highwaysCost?: string;
  isKmDifferenceAccepted?: boolean;
  stopTime?: number;
  editedBy?: {
    role?: UserRole;
    id?: string;
  };
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
  > {
  ids: string[];
}
export function updateManyOrders(params: UpdateManyOrdersParams) {
  return fetchJson<Order[]>(getNextApiPath(`${ApiRoutes.ORDERS}`), {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export interface CancelOrderByClientParams {
  id: string;
  isClient: boolean;
}

export function cancelOrderByClient(params: CancelOrderByClientParams) {
  return fetchJson<Order>(getNextApiPath(`${ApiRoutes.ORDERS}/clients/${params.id}`), {
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
  locationVia: z.array(locationViaPointSchema.optional()).optional(),
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
  deletedAt?: boolean;
  column?: string;
  sort?: 'asc' | 'desc';
}

export function getDrivers({ page, limit, deletedAt, column, sort }: GetDriversParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    deletedAt: deletedAt ? deletedAt.toString() : '',
    column: column || '',
    sort: sort || '',
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
  password: z
    .string()
    .regex(
      new RegExp(ValidationPattern.PASSWORD_VALIDATION),
      'Hasło musi zawierać przynajmniej 6 znaków, przynajmniej jedną wielką literę, jeden znak specjalny oraz jedną cyfrę'
    )
    .min(6, 'Hasło musi zawierać przynajmniej 6 znaków.'),
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
  password: z
    .string()
    .refine((data) => {
      if (data === '' || !data) {
        return true;
      }

      if (data.length < 6) return false;

      const passwordRegexp = new RegExp(ValidationPattern.PASSWORD_VALIDATION);

      return passwordRegexp.test(data);
    }, 'Hasło musi zawierać 6 liter, przynajmniej jedną wielką literę, jeden znak specjalny oraz jedną cyfrę')
    .optional(),

  car: z
    .object({
      carModel: z.string(),
      carBrand: z.string(),
      carColor: z.string().optional(),
      carRegistrationNumber: z.string(),
    })
    .optional(),
});

export type UpdateDriverParams = z.infer<typeof updateDriverSchema>;

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
  deletedAt?: boolean;
}

export function getCollectionPoints({ page, limit, deletedAt }: GetCollectionPointsParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    deletedAt: deletedAt ? deletedAt.toString() : '',
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
  fullAddress: z.string().nonempty(),
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
export function getClient(id: string) {
  return fetchJson<GetClientResponse>(getNextApiPath(`${ApiRoutes.CLIENTS}/${id}`), {
    method: 'GET',
  });
}

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
  login: z.string(),
  password: z
    .string()
    .regex(
      new RegExp(ValidationPattern.PASSWORD_VALIDATION),
      'Hasło musi zawierać przynajmniej 6 znaków, przynajmniej jedną wielką literę, jeden znak specjalny oraz jedną cyfrę'
    )
    .min(6, 'Hasło musi zawierać przynajmniej 6 znaków.'),
});

export type CreateOperatorParams = z.infer<typeof createOperatorSchema>;

export function createOperator(params: CreateOperatorParams) {
  return fetchJson<Driver>(getNextApiPath(ApiRoutes.OPERATORS), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export const updateOperatorSchema = z.object({
  name: z.string(),
  login: z.string(),
  password: z
    .string()
    .refine((data) => {
      if (data === '' || !data) {
        return true;
      }

      if (data.length < 6) return false;

      const passwordRegexp = new RegExp(ValidationPattern.PASSWORD_VALIDATION);

      return passwordRegexp.test(data);
    }, 'Hasło musi zawierać 6 liter, przynajmniej jedną wielką literę, jeden znak specjalny oraz jedną cyfrę')
    .optional(),
});

export type UpdateOperatorParams = z.infer<typeof updateOperatorSchema>;

export function updateOperator(id: string, params: UpdateOperatorParams) {
  return fetchJson<Operator>(getNextApiPath(`${ApiRoutes.OPERATORS}/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export interface GetOperatorsParams {
  page: number;
  limit: number;
  column?: string;
  sort?: 'asc' | 'desc';
}

export function getOperators({ page, limit, column, sort }: GetOperatorsParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    column: column || '',
    sort: sort || '',
  });
  return fetchJson<GetOperatorsResponse>(
    getNextApiPath(ApiRoutes.OPERATORS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

export function getOperator(id: string) {
  return fetchJson<GetOperatorResponse>(getNextApiPath(`${ApiRoutes.OPERATORS}/${id}`), {
    method: 'GET',
  });
}

export function removeOperator(id: string) {
  return fetchJson<Operator>(getNextApiPath(`${ApiRoutes.OPERATORS}/${id}`), {
    method: 'DELETE',
  });
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

// Passenger endpoints

export interface CreatePassengerParams {
  name: string;
  phones: string[];
  clients: string[];
}

export function createPassenger(params: CreatePassengerParams) {
  return fetchJson<Passenger>(getNextApiPath(ApiRoutes.PASSENGERS), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export type UpdatePassengerParams = CreatePassengerParams;

export function updatePassenger(id: string, params: UpdatePassengerParams) {
  return fetchJson<Passenger>(getNextApiPath(`${ApiRoutes.PASSENGERS}/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(params),
  });
}

export interface GetPassengersParams {
  page: number;
  limit: number;
  column?: string;
  sort?: 'asc' | 'desc';
  clientId?: string | null;
}

export function getPassengers({ page, limit, column, sort, clientId }: GetPassengersParams) {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    column: column || '',
    sort: sort || '',
    clientId: clientId || '',
  });
  return fetchJson<GetPassengersResponse>(
    getNextApiPath(ApiRoutes.PASSENGERS + '?' + queryParams.toString()),
    {
      method: 'GET',
    }
  );
}

export function getPassenger(id: string) {
  return fetchJson<GetPassengerResponse>(getNextApiPath(`${ApiRoutes.PASSENGERS}/${id}`), {
    method: 'GET',
  });
}

export function removePassenger(id: string) {
  return fetchJson<Operator>(getNextApiPath(`${ApiRoutes.PASSENGERS}/${id}`), {
    method: 'DELETE',
  });
}
