import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';

export const errorResponseHandler = (error: Error) => {
  logger.error(error);

  if (error?.message === 'unauthorizedError') {
    return new NextResponse(JSON.stringify({ status: 'error', message: 'You are not logged in' }), {
      status: 401,
    });
  }

  return new NextResponse(
    JSON.stringify({
      status: 'error',
      message: (error as Error).message,
    }),
    { status: 500 }
  );
};
