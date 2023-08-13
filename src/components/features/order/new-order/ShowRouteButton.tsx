import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { generateRouteMapLink } from '@/lib/helpers/generateRouteMapLink';
import { useCollectionPoints } from '@/lib/hooks/data/useCollectionPoints';

import { allowCalculation } from '@/components/features/order/new-order/utils';
import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ShowRouteButton = () => {
  const { watch } = useFormContext<OrderDetailsFormDefaultValues>();
  const { data: collectionPoints } = useCollectionPoints({ page: 1, limit: 1000 });

  const locationFrom = watch('locationFrom');
  const locationTo = watch('locationTo');
  const locationVia = useWatch({ name: 'locationVia' });
  const collectionPointWatch = useWatch({ name: 'collectionPointId' });

  const collectionPointGeoData = useMemo(() => {
    const collectionPoint = collectionPoints?.results.find(
      (res) => collectionPointWatch === res.id
    );

    return collectionPoint
      ? {
          address: {
            lat: collectionPoint.lat,
            lng: collectionPoint.lng,
          },
        }
      : undefined;
  }, [collectionPointWatch, collectionPoints?.results]);

  const isCalculationEnabled = allowCalculation({ locationFrom, locationVia, locationTo });

  const generateRouteMapLinkHandler = useCallback(() => {
    const viaPoints = locationVia && locationVia.length > 0 ? [...locationVia] : [];
    const locationPoints = [
      collectionPointGeoData,
      locationFrom,
      ...viaPoints,
      locationTo,
      collectionPointGeoData,
    ]
      .filter((loc) => loc)
      .map((point) => ({
        lat: point.address.lat,
        lng: point.address.lng,
      }));

    window.open(generateRouteMapLink(locationPoints), '_blank');
  }, [collectionPointGeoData, locationFrom, locationTo, locationVia]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className='block'>
            <Button
              disabled={!isCalculationEnabled}
              type='button'
              onClick={generateRouteMapLinkHandler}
            >
              Podgląd trasy
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {isCalculationEnabled ? (
            <>Naciśnij aby podejrzeć trasę</>
          ) : (
            <>Dodaj przynajmniej dwie lokalizacje aby podejrzeć trasę</>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
