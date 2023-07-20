'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useCreateCollectionPoint } from '@/lib/hooks/data/useCreateCollectionPoint';
import {
  CreateCollectionPointParams,
  createCollectionPointSchema,
} from '@/lib/server/api/endpoints';

import { PlaceDetails, PlacesAutocomplete } from '@/components/features/places/PlacesAutocomplete';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Routes } from '@/constant/routes';

export function NewCollectionPoint() {
  const form = useForm<CreateCollectionPointParams>({
    resolver: zodResolver(createCollectionPointSchema),
    defaultValues: {
      name: '',
      fullAddress: '',
    },
  });
  const router = useRouter();
  const { mutateAsync: createCollectionPoint } = useCreateCollectionPoint();

  const onSubmit = async (values: CreateCollectionPointParams) => {
    // eslint-disable-next-line no-console
    await createCollectionPoint(values);

    router.push(Routes.COLLECTION_POINTS);
  };

  const onAddressSelect = (details: PlaceDetails) => {
    const city =
      details.address_components?.find((place) => place.types.includes('locality'))?.short_name ||
      '';

    form.setValue('city', city);
    form.setValue('url', details.url);
    form.setValue('lat', details.geometry.location.lat().toString());
    form.setValue('lng', details.geometry.location.lng().toString());
  };

  return (
    <div className='lg:max-w-2xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input placeholder='Nazwa' {...field} />
                </FormControl>
                <FormDescription>
                  Wprowadź nazwę, która ułatwi ci późniejsze wyszukanie punktu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <PlacesAutocomplete
            name='fullAddress'
            onSelect={onAddressSelect}
            description='Celem wyszukania lokalizacji wprowadź kompleny adres lub jego część np. miasto lub ulicę.'
          />
          <div className='flex w-full items-center justify-end'>
            <Button className='w-full md:w-auto' type='submit'>
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
