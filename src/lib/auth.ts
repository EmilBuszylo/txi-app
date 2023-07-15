import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: true,
          },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        if (user) {
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } else {
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
};
