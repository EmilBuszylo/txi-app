import { useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { PlaceDetails, PlacesAutocomplete } from '@/components/features/places/PlacesAutocomplete';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface LocationViaSectionItemProps {
  index: number;
  defaultMapUrl?: string;
}

export const LocationViaSectionItem = ({ index, defaultMapUrl }: LocationViaSectionItemProps) => {
  const { control, setValue, watch } = useFormContext();
  const fieldName = `locationVia[${index}]`;

  const watchFullAddressValue = watch(`${fieldName}.address.fullAddress`);

  const onAddressFromSelect = (details: PlaceDetails) => {
    const city =
      details.address_components?.find((place) => place.types.includes('locality'))?.short_name ||
      '';

    setValue(`${fieldName}.address.city`, city);
    setValue(`${fieldName}.address.url`, details.url);
    setValue(`${fieldName}.address.lat`, details.geometry.location.lat().toString());
    setValue(`${fieldName}.address.lng`, details.geometry.location.lng().toString());
  };

  return (
    <AccordionItem value={fieldName} key={fieldName} className='mb-4 rounded bg-gray-100 p-2'>
      <AccordionTrigger className='text-md px-2 font-medium'>
        <div className='flex items-center truncate'>
          <span className='mr-1 font-semibold'>{index + 1}.</span>
          {watchFullAddressValue || 'Nowy adres pośredni'}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex flex-col gap-4'>
          <FormField
            control={control}
            name={`${fieldName}.date`}
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Data/godzina</FormLabel>
                <Input placeholder='Wprowadź imię pasażera' {...field} type='datetime-local' />
                <FormMessage />
                <FormDescription>Podaj datę i godzinę przejazdu</FormDescription>
              </FormItem>
            )}
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
