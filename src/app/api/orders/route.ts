import { NextResponse } from 'next/server';

import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { OrderStatus } from '@/server/orders/order';
import { createOrder, getOrders, updateManyOrders } from '@/server/orders/orders.service';

export async function POST(req: Request) {
  try {
    await authorizeRoute();

    const body = await req.json();
    const res = await createOrder(body);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}

export async function PATCH(req: Request) {
  try {
    await authorizeRoute();

    const body = await req.json();
    const res = await updateManyOrders(body);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}

export async function GET(req: Request) {
  const urlParams = new URL(req.url);

  try {
    await authorizeRoute();

    const orders = await getOrders({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
      noLimit: urlParams.searchParams.get('noLimit')
        ? urlParams.searchParams.get('noLimit') === 'true'
        : undefined,
      status: (urlParams.searchParams.get('status') as OrderStatus) || undefined,
      clientName: urlParams.searchParams.get('clientName') || undefined,
      driverId: urlParams.searchParams.get('driverId') || undefined,
      hasActualKm: urlParams.searchParams.get('hasActualKm')
        ? urlParams.searchParams.get('hasActualKm') === 'true'
        : undefined,
      clientInvoice: urlParams.searchParams.get('clientInvoice') || undefined,
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
