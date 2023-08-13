import { useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { useLocationsDateInfo } from '@/components/features/order/new-order/hooks/useLocationsDateInfo';
import { PlaceDetails, PlacesAutocomplete } from '@/components/features/places/PlacesAutocomplete';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

export const LocationFromSection = ({ defaultMapUrl }: { defaultMapUrl?: string }) => {
  const { control, setValue } = useFormContext();
  const locationDateInfo = useLocationsDateInfo({ isClient: true });

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
        className='bg-gray-50 px-4 py-2'
      >
        <AccordionItem value='locationFrom'>
          <AccordionTrigger className='text-lg font-medium'>Lokalizacja Z</AccordionTrigger>
          <AccordionContent>
            <div className='flex flex-col gap-4'>
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
                            <FormDescription>
                              Podaj datę i godzinę rozpoczęcia przejazdu
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
                      <FormDescription>Podaj datę i godzinę rozpoczęcia przejazdu</FormDescription>
                    </FormItem>
                  )
                }
              />
              <PlacesAutocomplete
                name='locationFrom.address.fullAddress'
                onSelect={onAddressFromSelect}
                description='Celem wyszukania lokalizacji wprowadź kompleny adres lub jego część np. miasto lub ulicę.'
                defaultMapUrl={defaultMapUrl}
              />
              <FormField
                control={control}
                name='locationFrom.passenger.firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię</FormLabel>
                    <FormControl>
                      <Input placeholder='Wprowadź imię pasażera' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='locationFrom.passenger.lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder='Wprowadź nazwisko pasażera' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='locationFrom.passenger.phone'
                render={({ field }) => {
                  // eslint-disable-next-line unused-imports/no-unused-vars
                  const { ref, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Numer kontaktowy</FormLabel>
                      <FormControl>
                        <div>
                          <PatternFormat
                            format='+48 ### ### ###'
                            customInput={Input}
                            {...rest}
                            placeholder='Numer kontaktowy pasażera'
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Podczas wprowadzania nr kontaktowego, numer zostanie sformatowany
                        automatycznie.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <FormDescription className='mt-2'>
          Wprowadź informacje niezbędne do określenia punktu startowego zlecenia. Aby to zrobić
          naciśnij napis &quot;Lokalizacja Z&quot;
        </FormDescription>
      </Accordion>
    </div>
  );
};
