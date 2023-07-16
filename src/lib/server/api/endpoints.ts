import { z } from 'zod';

import fetchJson from '@/lib/helpers/fetch-json';

import { SITE_URL } from '@/constant/env';
import { ApiRoutes } from '@/constant/routes';
import { ValidationPattern } from '@/constant/validation';
import { GetDriversResponse } from '@/server/drivers/drivers.service';
import { Order } from '@/server/orders/order';
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
  externalId: z.string().optional(),
});

export type CreateOrderParams = z.infer<typeof createOrderSchema>;

export function createOrder({ externalId }: CreateOrderParams) {
  return fetchJson<Order>(getNextApiPath(ApiRoutes.ORDERS), {
    method: 'POST',
    body: JSON.stringify({ externalId }),
  });
}

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

export const createDriverSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  password: z.string().regex(ValidationPattern.PASSWORD_VALIDATION),
  car: z.object({
    model: z.string(),
    brand: z.string(),
    color: z.string().optional(),
    registrationNumber: z.string(),
  }),
  withOwnCar: z.boolean().optional(),
});

export type CreateDriverParams = z.infer<typeof createDriverSchema>;

export function createDriver(params: CreateDriverParams) {
  return fetchJson<Order>(getNextApiPath(ApiRoutes.DRIVERS), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}