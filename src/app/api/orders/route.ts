import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';

import { OrderStatus } from '@/server/orders/order';
import { createOrder, getOrders, updateManyOrders } from '@/server/orders/orders.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await createOrder(body);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: (error as Error).message,
      }),
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const res = await updateManyOrders(body);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: (error as Error).message,
      }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const urlParams = new URL(req.url);

  try {
    const orders = await getOrders({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
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
    logger.error(error);
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: (error as Error).message,
      }),
      { status: 500 }
    );
  }
}
