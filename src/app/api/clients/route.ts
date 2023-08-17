import { NextRequest, NextResponse } from 'next/server';

import { authorizeRoute } from '@/lib/server/utils/authorize-route';
import { errorResponseHandler } from '@/lib/server/utils/error-response-handler';

import { getClients } from '@/server/clients/clients.service';

export async function GET(req: NextRequest) {
  const urlParams = new URL(req.url);

  try {
    await authorizeRoute();
    const clients = await getClients({
      page: Number(urlParams.searchParams.get('page')) || 1,
      limit: Number(urlParams.searchParams.get('limit')) || 1,
    });

    return NextResponse.json(clients);
  } catch (error) {
    return errorResponseHandler(error as Error);
  }
}
