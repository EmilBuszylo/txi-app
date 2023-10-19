import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { todayWithoutTimeZone } from '@/lib/helpers/date';

import { useLocationsDateInfo } from '@/components/features/order/new-order/hooks/useLocationsDateInfo';
import { PassengerField } from '@/components/features/order/new-order/passenger-field/PassengerField';
import { PlaceDetails, PlacesAutocomplete } from '@/components/features/places/PlacesAutocomplete';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const LocationFromSection = ({
  defaultMapUrl,
  isClient = false,
}: {
  defaultMapUrl?: string;
  isClient?: boolean;
}) => {
  const { control, setValue } = useFormContext();
  const [isOpen, setIsOpen] = useState(true);
  const locationDateInfo = useLocationsDateInfo({ isClient });

  const onAddressFromSelect = (details: PlaceDetails) => {
    const city =
      details.address_components?.find((place) => place.types.includes('locality'))?.short_name ||
      '';

    setValue('locationFrom.address.city', city);
    setValue('locationFrom.address.url', details.url);
    setValue('locationFrom.address.lat', details.geometry.location.lat().toString());
    setValue('locationFrom.address.lng', details.geometry.location.lng().toString());
  };

  const isDateInputDisabled = locationDateInfo.isToDateFilled || locationDateInfo.isViaDateFilled;
  return (
    <div>
      <Accordion
        type='single'
        collapsible
        defaultValue='locationFrom'
        className='bg-gray-50 py-2'
        onValueChange={(e) => {
          if (e === '') {
            setIsOpen(false);
          } else {
            setIsOpen(true);
          }
        }}
      >
        <AccordionItem value='locationFrom'>
          <AccordionTrigger className='px-4 text-lg font-medium'>Miejsce odbioru</AccordionTrigger>
          <AccordionContent>
            <div className='flex flex-col gap-4 px-4'>
              <FormField
                control={control}
                name='locationFrom.date'
                render={({ field }) =>
                  isDateInputDisabled ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger disabled={true}>
                          <FormItem className='flex flex-col items-start'>
                            <FormLabel>Data/godzina</FormLabel>
                            <Input
                              {...field}
                              type='datetime-local'
                              disabled={isDateInputDisabled}
                            />
                            <FormMessage />
                            <FormDescription>Podaj datę i godzinę odbioru pasażera</FormDescription>
                          </FormItem>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isDateInputDisabled
                            ? 'Tylko jedno wypełnione pole z datą jest dozwolone.'
                            : null}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <FormItem className='flex flex-col items-start'>
                      <FormLabel>Data/godzina</FormLabel>
                      <Input
                        {...field}
                        type='datetime-local'
                        disabled={isDateInputDisabled}
                        min={isClient ? todayWithoutTimeZone : undefined}
                      />
                      <FormMessage />
                      <FormDescription>Podaj datę i godzinę odbioru pasażera</FormDescription>
                    </FormItem>
                  )
                }
              />
              <PlacesAutocomplete
                name='locationFrom.address.fullAddress'
                onSelect={onAddressFromSelect}
                description='Celem wyszukania lokalizacji wprowadź kompletny adres lub jego część np. miasto lub ulicę.'
                defaultMapUrl={defaultMapUrl}
              />
              <PassengerField name='locationFrom.passenger.additionalPassengers' />
            </div>
          </AccordionContent>
        </AccordionItem>
        {!isOpen && (
          <FormDescription className='mt-2 px-4'>
            Wprowadź informacje niezbędne do określenia punktu startowego zlecenia. Aby to zrobić
            naciśnij napis &quot;Miejsce odbioru&quot;
          </FormDescription>
        )}
      </Accordion>
    </div>
  );
};
