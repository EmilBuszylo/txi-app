import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

import { calculateDistance } from '@/lib/helpers/distance';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

type User = Prisma.UserGetPayload<Record<string, unknown>>;

export async function POST(req: Request) {
  try {
    const { firstName, lastName, phone, login, password, role } = (await req.json()) as {
      firstName: string;
      lastName: string;
      login: string;
      password: string;
      phone?: string;
      role: User['role'];
    };
    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        login,
        phone,
        role,
        password: hashed_password,
      },
      select: {
        id: true,
        login: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({
      user,
    });
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

//  TODO to test remove after
export async function GET() {
  const res = await calculateDistance(
    [
      { lng: '21.044144', lat: '52.3012019' },
      { lat: '52.2985431', lng: '21.0489681' },
      { lat: '52.39912289999999', lng: '16.9292881' },
      { lat: '52.265005', lng: '21.0400045' },
    ],
    true
  );

  // eslint-disable-next-line no-console
  console.log(res);

  return 'ok';
}
