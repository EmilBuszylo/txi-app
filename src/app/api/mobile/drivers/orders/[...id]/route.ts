import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { RouteContext } from '@/lib/server/api/types';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { validateRequest } from '@/server/auth/auth.service';
import { getDriverOrderDetails, updateDriverOrder } from '@/server/drivers/drivers.service';

export async function PATCH(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';
  const accessToken = req.headers.get('Authorization');

  try {
    await validateRequest(accessToken);

    const body = await req.json();
    const res = await updateDriverOrder({ ...body, orderId: id });

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}

export async function GET(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';
  const accessToken = req.headers.get('Authorization');

  try {
    await validateRequest(accessToken);

    const res = await getDriverOrderDetails(id);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(error as Error);
  }
}
