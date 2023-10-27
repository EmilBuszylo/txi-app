import { ReadonlyURLSearchParams } from 'next/dist/client/components/navigation';

export const queryParamsToObject = (
  queryParams: ReadonlyURLSearchParams,
  excludedParams: string[]
) => {
  const params: Record<string, string> = {};
  if (queryParams) {
    queryParams.forEach((value, key) => {
      if (!excludedParams.includes(key)) {
        params[key as never] = value.toString();
      }
    });
  }

  return params;
};

export const getCurrentQueryParams = (
  queryParams: ReadonlyURLSearchParams,
  excludedParams: string[],
  newParams: Record<string, string>
) => {
  const oldParams = queryParamsToObject(queryParams, ['limit']);
  return new URLSearchParams({ ...oldParams, ...newParams });
};
