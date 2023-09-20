import { logger } from '@/lib/logger';

export interface ApiError {
  statusCode: number;
  error: string;
  message: string | string[];
}

export class FetchError extends Error {
  response: Response;
  data: ApiError;
  constructor({
    message,
    response,
    data,
  }: {
    message: string | string[];
    response: Response;
    data: ApiError;
  }) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(Array.isArray(message) ? message.join(', ') : message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = this.constructor.name;
    this.response = response;
    this.data = data ?? { message, error: 'FetchError', statusCode: 500 };
  }
}

export default async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  try {
    logger.error({ input, init, stack: 'fetchJson error' });
    const response = await fetch(input, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    logger.error(2);
    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json();
    logger.error(3, { data, response });
    // response.ok is true when res.status is 2xx
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
    if (response.ok) {
      return data;
    }

    throw new FetchError({
      message: response.statusText,
      response,
      data,
    });
  } catch (error) {
    logger.error({ error, stack: 'fetchJson error' });
    throw new Error((error as Error).message);
  }
}
