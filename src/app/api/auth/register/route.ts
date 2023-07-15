import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

type User = Prisma.UserGetPayload<Record<string, unknown>>;

export async function POST(req: Request) {
  try {
    const { firstName, lastName, phone, email, password, role } = (await req.json()) as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone?: string;
      role: User['role'];
    };
    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        role,
        password: hashed_password,
      },
      select: {
        id: true,
        email: true,
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
