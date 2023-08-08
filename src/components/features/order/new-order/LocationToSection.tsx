import { useFormContext } from 'react-hook-form';

import { PlaceDetails, PlacesAutocomplete } from '@/components/features/places/PlacesAutocomplete';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const LocationToSection = ({ defaultMapUrl }: { defaultMapUrl?: string }) => {
  const { control, setValue } = useFormContext();

  const onAddressFromSelect = (details: PlaceDetails) => {
    const city =
      details.address_components?.find((place) => place.types.includes('locality'))?.short_name ||
      '';

    setValue('locationTo.address.city', city);
    setValue('locationTo.address.url', details.url);
    setValue('locationTo.address.lat', details.geometry.location.lat().toString());
    setValue('locationTo.address.lng', details.geometry.location.lng().toString());
  };

  return (
    <div>
      <Accordion type='single' collapsible defaultValue='locationTo' className='pb-6 pt-2'>
        <AccordionItem value='locationTo'>
          <AccordionTrigger className='text-lg font-medium'>Lokalizacja Do</AccordionTrigger>
          <AccordionContent>
            <div className='flex flex-col gap-4'>
              <FormField
                control={control}
                name='locationTo.date'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Data/godzina</FormLabel>
                    <Input placeholder='Wprowadź imię pasażera' {...field} type='datetime-local' />
                    <FormMessage />
                    <FormDescription>Podaj datę i godzinę rozpoczęcia przejazdu</FormDescription>
                  </FormItem>
                )}
              />
              <PlacesAutocomplete
                name='locationTo.address.fullAddress'
                onSelect={onAddressFromSelect}
                description='Celem wyszukania lokalizacji wprowadź kompleny adres lub jego część np. miasto lub ulicę.'
                defaultMapUrl={defaultMapUrl}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <FormDescription>
        Wprowadź informacje niezbędne do określenia punktu końcowego zlecenia. Aby to zrobić
        naciśnij napis &quot;Lokalizacja Do&quot;
      </FormDescription>
    </div>
  );
};
