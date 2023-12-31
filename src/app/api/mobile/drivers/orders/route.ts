import { NextResponse } from 'next/server';

import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { validateRequest } from '@/server/auth/auth.service';
import { getDriverOrders } from '@/server/drivers/drivers.service';
import { OrderStatus } from '@/server/orders/order';
export async function GET(req: Request) {
  const urlParams = new URL(req.url);
  const accessToken = req.headers.get('Authorization');

  try {
    await validateRequest(accessToken);

    const statuses =
      typeof urlParams.searchParams.get('statuses') === 'string'
        ? (urlParams.searchParams.get('statuses') as string)
        : undefined;

    const orders = await getDriverOrders({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
      statuses: statuses ? (statuses.split(',') as unknown as OrderStatus[]) : undefined,
      acceptedByDriver: urlParams.searchParams.get('acceptedByDriver')
        ? urlParams.searchParams.get('acceptedByDriver') === 'true'
        : undefined,
      driverId: urlParams.searchParams.get('driverId') || '',
      completedAtFrom: urlParams.searchParams.get('completedAtFrom') || undefined,
      completedAtTo: urlParams.searchParams.get('completedAtTo') || undefined,
      column: urlParams.searchParams.get('column') || undefined,
      sort: (urlParams.searchParams.get('sort') as 'asc' | 'desc') || undefined,
    });

    return NextResponse.json(orders);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}
