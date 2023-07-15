import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export const middleware = async (req: NextRequest) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const url = new URL(`/auth/login`, req.url);
    url.searchParams.set('callbackUrl ', encodeURI(req.url));
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: ['/((?!register|api|auth/login|_next|favicon).*)'],
};
