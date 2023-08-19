import { JWT as AuthJWT } from 'next-auth/jwt';

import { User as AppUser } from '@/server/users/user';

declare module 'next-auth' {
  type User = User;
  interface Session {
    user?: AppUser;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends AuthJWT {
    user: AppUser;
  }
}
