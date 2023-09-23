import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/helpers/fetch-json';
import { logger } from '@/lib/logger';

export const errorResponseHandler = (error: Error) => {
  logger.error(error);

  if (error?.message === 'unauthorizedError') {
    return new NextResponse(JSON.stringify({ status: 'error', message: 'You are not logged in' }), {
      status: 401,
    });
  }

  if (
    (error as unknown as Record<string, unknown>)?.code &&
    (error as unknown as Record<string, unknown>).code === 'P2002'
  ) {
    return new NextResponse(
      JSON.stringify({
        statusCode: 409,
        message: (error as Error).message,
        error: error,
      } as ApiError),
      { status: 409 }
    );
  }

  return new NextResponse(
    JSON.stringify({
      statusCode: 500,
      message: (error as Error).message,
      error: error,
    } as ApiError),
    { status: 500 }
  );
};
