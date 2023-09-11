import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useLocationsDateInfo } from '@/components/features/order/new-order/hooks/useLocationsDateInfo';
import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';
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

export const LocationToSection = ({
  defaultMapUrl,
  isClient = false,
}: {
  defaultMapUrl?: string;
  isClient?: boolean;
}) => {
  const { control, setValue } = useFormContext<OrderDetailsFormDefaultValues>();
  const [isOpen, setIsOpen] = useState(true);
  const locationDateInfo = useLocationsDateInfo({ isClient });
  const onAddressFromSelect = (details: PlaceDetails) => {
    const city =
      details.address_components?.find((place) => place.types.includes('locality'))?.short_name ||
      '';

    setValue('locationTo.address.city', city);
    setValue('locationTo.address.url', details.url);
    setValue('locationTo.address.lat', details.geometry.location.lat().toString());
    setValue('locationTo.address.lng', details.geometry.location.lng().toString());
  };

  const isDateInputDisabled = locationDateInfo.isFromDateFilled || locationDateInfo.isViaDateFilled;

  return (
    <div>
      <Accordion
        type='single'
        collapsible
        defaultValue='locationTo'
        className='bg-gray-50 py-2'
        onValueChange={(e) => {
          if (e === '') {
            setIsOpen(false);
          } else {
            setIsOpen(true);
          }
        }}
      >
        <AccordionItem value='locationTo'>
          <AccordionTrigger className='px-4 text-lg font-medium'>Miejsce docelowe</AccordionTrigger>
          <AccordionContent>
            <div className='flex flex-col gap-4 px-4'>
              <FormField
                control={control}
                name='locationTo.date'
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
                            <FormDescription>
                              Podaj datę i godzinę zakończenia przejazdu
                            </FormDescription>
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
                      <Input {...field} type='datetime-local' disabled={isDateInputDisabled} />
                      <FormMessage />
                      <FormDescription> Podaj datę i godzinę zakończenia przejazdu</FormDescription>
                    </FormItem>
                  )
                }
              />
              <PlacesAutocomplete
                name='locationTo.address.fullAddress'
                onSelect={onAddressFromSelect}
                description='Celem wyszukania lokalizacji wprowadź kompletny adres lub jego część np. miasto lub ulicę.'
                defaultMapUrl={defaultMapUrl}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        {!isOpen && (
          <FormDescription className='mt-2 px-4'>
            Wprowadź informacje niezbędne do określenia punktu końcowego zlecenia. Aby to zrobić
            naciśnij napis &quot;Miejsce docelowe&quot;
          </FormDescription>
        )}
      </Accordion>
    </div>
  );
};
