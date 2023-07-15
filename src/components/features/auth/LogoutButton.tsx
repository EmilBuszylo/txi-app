'use client';

import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  return <button onClick={() => signOut({ callbackUrl: '/auth/login' })}>Sign Out</button>;
};
