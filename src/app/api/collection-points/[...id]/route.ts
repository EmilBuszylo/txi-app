import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { RouteContext } from '@/lib/server/api/types';

import {
  getCollectionPoint,
  removeCollectionPoint,
  updateCollectionPoint,
} from '@/server/collection-points.ts/collection-points.service';

export async function GET(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    const res = await getCollectionPoint(id);

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

export async function POST(req: Request, context: RouteContext) {
  const id = context.params?.id?.[0] || '';

  try {
    const body = await req.json();
    const res = await updateCollectionPoint(id, body);

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
    const res = await removeCollectionPoint(id);

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
