import { NextResponse } from 'next/server';

import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { resendOrderEmail } from '@/server/orders/orders.service';

export async function POST(req: Request) {
  try {
    await authorizeRoute();

    const body = await req.json();
    const res = await resendOrderEmail(body);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}
