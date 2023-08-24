import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

export async function getUserFromSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect('auth/login');
  }

  return session.user;
}
