import { NextResponse } from 'next/server';

import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { getDriverOrders } from '@/server/drivers/drivers.service';
import { OrderStatus } from '@/server/orders/order';
export async function GET(req: Request) {
  const urlParams = new URL(req.url);

  try {
    await authorizeRoute();

    const orders = await getDriverOrders({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
      statuses: (urlParams.searchParams.get('statuses') as unknown as OrderStatus[]) || undefined,
      driverId: urlParams.searchParams.get('driverId') || '',
      createdAtTo: urlParams.searchParams.get('createdAtTo') || undefined,
      createdAtFrom: urlParams.searchParams.get('createdAtFrom') || undefined,
      column: urlParams.searchParams.get('column') || undefined,
      sort: (urlParams.searchParams.get('sort') as 'asc' | 'desc') || undefined,
    });

    return NextResponse.json(orders);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}
