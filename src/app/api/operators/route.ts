import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';

import { getOperators } from '@/server/operators/operators.service';

export async function GET(req: NextRequest) {
  const urlParams = new URL(req.url);

  try {
    const clients = await getOperators({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
    });

    return NextResponse.json(clients);
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
