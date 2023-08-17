import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

export const authorizeRoute = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('unauthorizedError');
  }
};
