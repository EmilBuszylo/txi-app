import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        login: { label: 'login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.login || !credentials.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              login: credentials.login,
            },
            select: {
              id: true,
              login: true,
              firstName: true,
              lastName: true,
              password: true,
              role: true,
              clientId: true,
            },
          });

          if (!user || !(await compare(credentials.password, user.password))) {
            return null;
          }

          if (user) {
            return {
              id: user.id,
              login: user.login,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              clientId: user.clientId,
            };
          } else {
            return null;
          }
        } catch (e) {
          logger.error(e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: 'auth/login',
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      session = {
        ...session,
        user: token.user,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        token.user = user;
      }
      return token;
    },
  },
};
