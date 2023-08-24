import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import { UserRole } from '@/server/users/user';

export const accessControl = async ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('auth/login');
  }

  if (!session.user?.role || !allowedRoles.includes(session.user.role)) {
    redirect('/');
  }
};
