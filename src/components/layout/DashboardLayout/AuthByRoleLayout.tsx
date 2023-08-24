'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import { UserRole } from '@/server/users/user';

export default function AuthByRoleLayout({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { data, status } = useSession();

  if (!data?.user && status !== 'loading') {
    redirect('auth/login');
  }

  if (data?.user?.role && !allowedRoles.includes(data?.user.role)) {
    redirect('/');
  }

  return children;
}
