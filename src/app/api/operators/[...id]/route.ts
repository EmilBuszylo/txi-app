import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { RouteContext } from '@/lib/server/api/types';
import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { getOperator, updateOperator } from '@/server/operators/operators.service';

export async function GET(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    await authorizeRoute();
    const res = await getOperator(id);

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
    const res = await updateOperator(id, body);

    return NextResponse.json(res);
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(error as Error);
  }
}
