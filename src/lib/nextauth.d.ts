// nextauth.d.ts
import { DefaultJWT } from 'next-auth/src/jwt/types';

interface IUser {
  id: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  login: string;
}
declare module 'next-auth' {
  type User = IUser;
  interface Session {
    user?: IUser;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    user: IUser;
  }
}
