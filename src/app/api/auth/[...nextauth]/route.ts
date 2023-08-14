import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest, res: NextResponse) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return NextAuth(req, res, authOptions);
}

export async function POST(req: NextRequest, res: NextResponse) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return NextAuth(req, res, authOptions);
}
