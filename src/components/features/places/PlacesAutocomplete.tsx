import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import usePlacesAutocompleteService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { StyledLink } from '@/components/ui/link/StyledLink';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import MapPinIcon from '~/svg/icons/map-pin.svg';

export interface PlaceDetails {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  geometry: {
    location: {
      lat: () => string;
      lng: () => string;
    };
  };
  url: string;
  formatted_address: string;
}

export interface PlacePredictionItem {
  description: string;
  place_id: string;
}

interface PlacesAutocompleteProps {
  name: string;
  onSelect: (details: PlaceDetails) => void;
  description?: string;
  defaultMapUrl?: string;
}

export const PlacesAutocomplete = ({
  name,
  onSelect,
  description,
  defaultMapUrl,
}: PlacesAutocompleteProps) => {
  const { control, setValue } = useFormContext();
  const [mapUrl, setMapUrl] = useState(defaultMapUrl);
  const { placePredictions, getPlacePredictions, placesService } = usePlacesAutocompleteService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: 'pl',
    debounce: 500,
  });

  return (
    <div className='relative'>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>Lokalizacja</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value || 'Wprowadź lokalizacje'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='p-0 md:w-[600px]' side='bottom' align='start'>
                <Command className='w-full'>
                  <CommandInput
                    placeholder='Wprowadź adres...'
                    onValueChange={(search) => {
                      getPlacePredictions({ input: search });
                    }}
                    className='w-full'
                  />
                  <CommandEmpty>Podanego adresu nie znaleziono</CommandEmpty>
                  <CommandGroup>
                    {placePredictions.map((place: PlacePredictionItem) => (
                      <CommandItem
                        value={place.description}
                        key={place.place_id}
                        onSelect={() => {
                          placesService.getDetails(
                            { placeId: place.place_id },
                            (details: PlaceDetails) => {
                              onSelect(details);
                              setValue(name, details.formatted_address);
                              setMapUrl(details.url);
                            }
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            place.description === field.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {place.description}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
      {mapUrl && (
        <StyledLink
          href={mapUrl}
          target='_blank'
          className='mt-1 flex items-center gap-x-1 lg:absolute lg:right-0 lg:top-[40%] lg:mt-0 lg:translate-x-[110%]'
        >
          Podgląd trasy <MapPinIcon className='h-6 w-6' />
        </StyledLink>
      )}
    </div>
  );
};
