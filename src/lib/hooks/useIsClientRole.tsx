import { useSession } from 'next-auth/react';

import { UserRole } from '@/server/users/user';

export const UseIsClientRole = () => {
  const { data } = useSession();

  return {
    isClient: data?.user?.role && data.user.role === UserRole.CLIENT,
    clientId: data?.user?.clientId,
  };
};
