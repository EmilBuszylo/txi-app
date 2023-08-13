import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { Waypoint } from '@/lib/helpers/distance';
import { useCalculateLocationsDistance } from '@/lib/hooks/data/useCalculateLocationsDistance';

import { allowCalculation } from '@/components/features/order/new-order/utils';
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
  const { control, watch, getValues, setValue } = useFormContext<OrderDetailsFormDefaultValues>();

  const locationFrom = watch('locationFrom');
  const locationTo = watch('locationTo');
  const locationVia = watch('locationVia');

  const { mutateAsync: calculateDistance, isLoading } = useCalculateLocationsDistance();

  const isCalculationEnabled = allowCalculation({ locationFrom, locationVia, locationTo });

  const calculateEstimatedKm = useCallback(async () => {
    const data = getValues();
    const collectionPointsGeoData = data?.collectionPointsGeoCodes
      ? data?.collectionPointsGeoCodes
      : defaultCollectionPointsGeo
      ? defaultCollectionPointsGeo
      : undefined;

    const viaPoints = locationVia && locationVia.length > 0 ? [...locationVia] : [];
    try {
      const { estimatedDistance, wayBackDistance } = await calculateDistance({
        locationFrom,
        locationTo,
        locationVia: viaPoints,
        collectionPointsGeoCodes: collectionPointsGeoData,
      });

      setValue(
        'estimatedKm',
        (estimatedDistance?.distance || 0) + (wayBackDistance?.distance || 0)
      );
    } catch {
      //  TODO add toast with error
      // console.log(error);
    }
  }, [
    calculateDistance,
    defaultCollectionPointsGeo,
    getValues,
    locationFrom,
    locationTo,
    locationVia,
    setValue,
  ]);

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
                        isLoading={isLoading}
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
