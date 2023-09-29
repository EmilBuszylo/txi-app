import { NextResponse } from 'next/server';

import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { createDriver, getDrivers } from '@/server/drivers/drivers.service';

export async function POST(req: Request) {
  try {
    await authorizeRoute();

    const body = await req.json();
    const res = await createDriver(body);

    return NextResponse.json(res);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}

export async function GET(req: Request) {
  const urlParams = new URL(req.url);

  try {
    await authorizeRoute();
    const drivers = await getDrivers({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
      deletedAt: urlParams.searchParams.get('deletedAt')
        ? urlParams.searchParams.get('deletedAt') === 'true'
        : undefined,
    });

    return NextResponse.json(drivers);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}
