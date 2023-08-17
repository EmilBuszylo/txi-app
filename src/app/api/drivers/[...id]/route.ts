import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { RouteContext } from '@/lib/server/api/types';
import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { getDriver, removeDriver, updateDriver } from '@/server/drivers/drivers.service';

export async function GET(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const res = await getDriver(id);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(error as Error);
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const body = await req.json();
    const res = await updateDriver(id, body);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(error as Error);
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const res = await removeDriver(id);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(error as Error);
  }
}
