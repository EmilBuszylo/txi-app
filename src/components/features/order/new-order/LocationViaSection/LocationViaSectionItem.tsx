import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { useLocationsDateInfo } from '@/components/features/order/new-order/hooks/useLocationsDateInfo';
import { PlaceDetails, PlacesAutocomplete } from '@/components/features/places/PlacesAutocomplete';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

interface LocationViaSectionItemProps {
  index: number;
  defaultMapUrl?: string;
  removeItem: () => void;
}

export const LocationViaSectionItem = ({
  index,
  defaultMapUrl,
  removeItem,
}: LocationViaSectionItemProps) => {
  const { control, watch } = useFormContext();
  const { update } = useFieldArray({
    name: 'locationVia',
    control: control,
  });
  const fieldName = `locationVia[${index}]`;
  const locationDateInfo = useLocationsDateInfo({ isClient: true });

  const watchFullAddressValue = watch(`${fieldName}.address.fullAddress`);

  const onAddressFromSelect = (details: PlaceDetails) => {
    const city =
      details.address_components?.find((place) => place.types.includes('locality'))?.short_name ||
      '';

    update(index, {
      address: {
        city,
        url: details.url,
        lat: details.geometry.location.lat().toString(),
        lng: details.geometry.location.lng().toString(),
      },
    });
  };

  const isDateInputDisabled = locationDateInfo.isToDateFilled || locationDateInfo.isFromDateFilled;

  return (
    <AccordionItem value={fieldName} key={fieldName} className='mb-4 w-full rounded bg-white p-2'>
      <div className='flex w-full items-center gap-x-2 [&>h3]:w-full'>
        <AccordionTrigger className='text-md w-full px-2 font-medium '>
          <div className='flex w-full w-full items-center justify-between'>
            <div className='flex w-full items-center truncate'>
              <span className='mr-1 font-semibold'>{index + 1}.</span>
              {watchFullAddressValue || 'Nowy adres pośredni'}
            </div>
          </div>
        </AccordionTrigger>
        <Button variant='destructive' onClick={removeItem} className='group mr-2 px-1'>
          <Trash2 className='h-6 w-6' />
        </Button>
      </div>
      <AccordionContent>
        <div className='flex flex-col gap-4'>
          <FormField
            control={control}
            name={`${fieldName}.date`}
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
                          onChange={(e) => {
                            return field.onChange(e);
                          }}
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
                  <FormDescription>Podaj datę i godzinę przejazdu</FormDescription>
                </FormItem>
              )
            }
          />
          <PlacesAutocomplete
            name={`${fieldName}.address.fullAddress`}
            onSelect={onAddressFromSelect}
            description='Celem wyszukania lokalizacji wprowadź kompleny adres lub jego część np. miasto lub ulicę.'
            defaultMapUrl={defaultMapUrl}
          />
          <FormField
            control={control}
            name={`${fieldName}.passenger.firstName`}
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
            name={`${fieldName}.passenger.lastName`}
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
            name={`${fieldName}.passenger.phone`}
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
                    Podczas wprowadzania nr kontaktowego, numer zostanie sformatowany automatycznie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
