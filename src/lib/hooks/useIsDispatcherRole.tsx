import { useSession } from 'next-auth/react';

import { UserRole } from '@/server/users/user';

export const UseIsDispatcherRole = () => {
  const { data } = useSession();

  return {
    isDispatcher: data?.user?.role && data.user.role === UserRole.DISPATCHER,
    userId: data?.user?.id,
  };
};
