import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { UserRole } from '@/server/users/user';

export { default } from 'next-auth/middleware';

export const middleware = async (req: NextRequest) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const redirectUrl = new URL(`/auth/login`, req.url);

  if (!token) {
    redirectUrl.searchParams.set('callbackUrl ', encodeURI(req.url));
    return NextResponse.redirect(redirectUrl);
  }

  if (token?.user.role === UserRole.DRIVER) {
    redirectUrl.searchParams.set('callbackUrl ', encodeURI(req.url));
    return NextResponse.redirect(redirectUrl);
  }
};

export const config = {
  matcher: ['/((?!register|api|auth/login|_next|favicon).*)'],
};
