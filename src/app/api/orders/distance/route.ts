import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';

import { calculateLocationsDistance } from '@/server/orders/orders.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await calculateLocationsDistance(body);

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
