import { useMutation } from '@tanstack/react-query';

import {
  calculateLocationsDistance,
  CalculateLocationsDistanceParams,
} from '@/lib/server/api/endpoints';

export function useCalculateLocationsDistance() {
  return useMutation({
    mutationFn: (params: CalculateLocationsDistanceParams) => calculateLocationsDistance(params),
  });
}
