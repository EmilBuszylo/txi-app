import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';

import {
  createCollectionPoint,
  getCollectionPoints,
} from '@/server/collection-points.ts/collection-points.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await createCollectionPoint(body);

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
    const collectionPoints = await getCollectionPoints({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
    });

    return NextResponse.json(collectionPoints);
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
