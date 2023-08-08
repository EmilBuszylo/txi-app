import { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { generateRouteMapLink } from '@/lib/helpers/generateRouteMapLink';

import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ShowRouteButton = () => {
  const { watch } = useFormContext<OrderDetailsFormDefaultValues>();

  const locationFrom = watch('locationFrom');
  const locationTo = watch('locationTo');
  const locationVia = watch('locationVia');

  const isCalculationEnabled = useMemo(() => {
    const viaPoints = locationVia && locationVia.length > 0 ? [...locationVia] : [];
    const locationsData = [locationFrom, ...viaPoints, locationTo];

    return locationsData.filter((l) => l.address?.lng && l.address?.lng).length >= 2;
  }, [locationFrom, locationTo, locationVia]);

  const generateRouteMapLinkHandler = useCallback(() => {
    const viaPoints = locationVia && locationVia.length > 0 ? [...locationVia] : [];

    const locationPoints = [locationFrom, ...viaPoints, locationTo].map((point) => ({
      lat: point.address.lat,
      lng: point.address.lng,
    }));

    window.open(generateRouteMapLink(locationPoints), '_blank');
  }, [locationFrom, locationTo, locationVia]);

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
