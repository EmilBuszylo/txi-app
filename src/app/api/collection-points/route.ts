import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { getCollectionPoints } from '@/lib/server/api/endpoints';

import { createCollectionPoint } from '@/server/collection-points.ts/collection-points.service';

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
  const urlParams = new URLSearchParams(req.url);

  try {
    const orders = await getCollectionPoints({
      page: Number(urlParams.get('page')) || 1,
      limit: Number(urlParams.get('limit')) || 1,
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
