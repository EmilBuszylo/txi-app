import { useSession } from 'next-auth/react';

export const UseUser = () => {
  const { data } = useSession();

  return {
    user: data?.user,
  };
};
