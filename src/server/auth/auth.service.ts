import { sign, verify } from 'jsonwebtoken';

import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export const createToken = ({ login, id }: { login: string; id: string }) => {
  return sign({ login, id }, process.env.JWT_SECRET, {
    expiresIn: '2 days',
  });
};

export const validateRequest = async (authHeader?: string | null) => {
  if (!authHeader) {
    const invalidCredentialsException = JSON.stringify({
      code: 401,
      message: 'token was not provided',
      type: 'invalidCredentialsException',
    });
    throw new Error(invalidCredentialsException);
  }

  const token = authHeader.split(' ')[1];

  if (authHeader.split(' ')[0] !== 'Bearer' || !token) {
    const invalidCredentialsException = JSON.stringify({
      code: 401,
      message: 'token was not provided',
      type: 'invalidCredentialsException',
    });
    throw new Error(invalidCredentialsException);
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded.id || !decoded.login) {
      const invalidCredentialsException = JSON.stringify({
        code: 401,
        message: 'token does not contain required data',
        type: 'invalidCredentialsException',
      });
      throw new Error(invalidCredentialsException);
    }

    await prisma.user.findUniqueOrThrow({ where: { id: decoded.id }, select: { id: true } });
  } catch (error) {
    logger.error({ error, stack: 'validateRequest' });
    const invalidCredentialsException = JSON.stringify({
      code: 401,
      message: (error as Error).message,
      type: 'invalidCredentialsException',
      error: error,
    });
    throw new Error(invalidCredentialsException);
  }
};

export interface JwtPayload {
  login: string;
  id: string;
}
