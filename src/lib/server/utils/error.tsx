import { FetchError } from '@/lib/helpers/fetch-json';

export interface PrismaClientKnownRequestError {
  code: string;
  meta: {
    target: string[];
  };
  name: string;
}

interface DatabaseErrorHandlerResponse {
  isDbError: boolean;
  targets: string[];
  code?: string;
  message?: string;
}

export const databaseErrorHandler = (error: FetchError): DatabaseErrorHandlerResponse => {
  if (error.data.error.name && error.data.error.name.toLowerCase().includes('prisma')) {
    const dbError = (error as FetchError).data.error as unknown as PrismaClientKnownRequestError;

    return {
      isDbError: true,
      targets: dbError.meta.target,
      code: dbError.code,
      message:
        messageByErrorCode[dbError.code as keyof typeof messageByErrorCode] ||
        DEFAULT_VALIDATION_MESSAGE,
    };
  }

  return {
    isDbError: false,
    targets: [],
  };
};

const DEFAULT_VALIDATION_MESSAGE = 'Wystąpił nieznany błąd, podana wartość jest nieprawidłowa.';

const messageByErrorCode = {
  P2002: 'Wartość dla powyższego pola musi być unikalna.',
};
