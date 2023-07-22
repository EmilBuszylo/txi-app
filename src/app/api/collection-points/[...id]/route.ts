import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { RouteContext } from '@/lib/server/api/types';

import { removeCollectionPoint } from '@/server/collection-points.ts/collection-points.service';

export async function DELETE(req: NextRequest, context: RouteContext) {
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
