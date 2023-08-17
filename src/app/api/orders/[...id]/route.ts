import { NextResponse } from 'next/server';

import { RouteContext } from '@/lib/server/api/types';
import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { getOrder, removeOrder, updateOrder } from '@/server/orders/orders.service';

export async function GET(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const res = await getOrder(id);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}

export async function PUT(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const body = await req.json();
    const res = await updateOrder(id, body);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const res = await removeOrder(id);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}
