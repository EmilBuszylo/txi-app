import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { calculateDistance, Waypoint } from '@/lib/helpers/distance';

import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EstimatedKmFieldProps {
  defaultCollectionPointsGeo?: Waypoint;
}

export const EstimatedKmField = ({ defaultCollectionPointsGeo }: EstimatedKmFieldProps) => {
  const { control, watch, getValues } = useFormContext<OrderDetailsFormDefaultValues>();

  const locationFrom = watch('locationFrom');
  const locationTo = watch('locationTo');
  const locationVia = watch('locationVia');

  const isCalculationEnabled = useMemo(() => {
    const viaPoints = locationVia && locationVia.length > 0 ? [...locationVia] : [];
    const locationsData = [locationFrom, ...viaPoints, locationTo];

    return locationsData.filter((l) => l.address?.lng && l.address?.lng).length >= 2;
  }, [locationFrom, locationTo, locationVia]);
  const calculateEstimatedKm = async () => {
    const data = getValues();
    const collectionPointsGeoData = data?.collectionPointsGeoCodes
      ? defaultCollectionPointsGeo
        ? defaultCollectionPointsGeo
        : undefined
      : undefined;

    const viaPoints = locationVia && locationVia.length > 0 ? [...locationVia] : [];

    const waypoints = [locationFrom, locationTo, ...viaPoints].map((l) => ({
      lat: l.address.lat,
      lng: l.address.lng,
    }));

    return await calculateDistance([
      ...waypoints,
      collectionPointsGeoData ? collectionPointsGeoData : undefined,
    ]);
    // eslint-disable-next-line no-console
  };

  return (
    <FormField
      control={control}
      name='estimatedKm'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Km szacowane</FormLabel>
          <FormControl>
            <div className='flex w-full items-center space-x-2'>
              <Input {...field} type='number' readOnly />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className='block'>
                      <Button
                        type='button'
                        disabled={!isCalculationEnabled}
                        onClick={calculateEstimatedKm}
                        className='w-fit whitespace-nowrap'
                      >
                        Przelicz długość trasy
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isCalculationEnabled ? (
                      <>Naciśnij aby obliczyć szacowaną długość trasy</>
                    ) : (
                      <>Dodaj przynajmniej dwie lokalizacje aby obliczyć szacowaną długość trasy</>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </FormControl>
          <FormDescription>
            W powyższym polu wyświetlana jest wyliczona na podstawie zaznaczonych punktów szacowana
            długość trasy podana w Km. Aby odświeżyć szacowaną długość trasy naciśnij przycisk
            &quot;Przelicz długość trasy&quot;
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
