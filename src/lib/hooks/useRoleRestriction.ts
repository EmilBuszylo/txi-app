import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { UserRole } from '@/server/users/user';

export const useRoleRestriction = (allowedRoles: UserRole[]) => {
  const { data } = useSession();

  if (data?.user?.role && !allowedRoles.includes(data?.user.role)) {
    redirect('/404');
  }
};
