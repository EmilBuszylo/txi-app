import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { RouteContext } from '@/lib/server/api/types';

import { getDriver, removeDriver, updateDriver } from '@/server/drivers/drivers.service';

export async function GET(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    const res = await getDriver(id);

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

export async function PATCH(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    const body = await req.json();
    const res = await updateDriver(id, body);

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

export async function DELETE(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    const res = await removeDriver(id);

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
