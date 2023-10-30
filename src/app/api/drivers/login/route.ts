import { NextResponse } from 'next/server';

import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { loginDriver } from '@/server/drivers/drivers.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await loginDriver(body);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}
