import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { RouteContext } from '@/lib/server/api/types';
import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { getDriverOrderDetails, updateDriverOrder } from '@/server/drivers/drivers.service';

export async function PATCH(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const body = await req.json();
    const res = await updateDriverOrder({ ...body, orderId: id });

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}

export async function GET(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const res = await getDriverOrderDetails(id);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(error as Error);
  }
}
