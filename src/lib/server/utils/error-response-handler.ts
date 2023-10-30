import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/helpers/fetch-json';
import { logger } from '@/lib/logger';

export const errorResponseHandler = (error: Error) => {
  logger.error(error);

  if ((error as unknown as Record<string, unknown>)?.type === 'invalidCredentialsException') {
    return new NextResponse(
      JSON.stringify({ statusCode: 401, status: 'error', message: error.message, error }),
      {
        status: 401,
      }
    );
  }

  if (error?.message === 'forbiddenError') {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        message: "you don't have permission to access this resource",
      }),
      {
        status: 403,
      }
    );
  }

  if ((error as unknown as Record<string, unknown>)?.type === 'notFoundException') {
    return new NextResponse(
      JSON.stringify({ statusCode: 404, status: 'error', message: error.message, error }),
      {
        status: 404,
      }
    );
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
