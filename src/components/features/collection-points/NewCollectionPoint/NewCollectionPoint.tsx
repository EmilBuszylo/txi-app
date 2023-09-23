'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { FetchError } from '@/lib/helpers/fetch-json';
import { useCreateCollectionPoint } from '@/lib/hooks/data/useCreateCollectionPoint';
import { useUpdateCollectionPoint } from '@/lib/hooks/data/useUpdateCollectionPoint';
import {
  CreateCollectionPointParams,
  createCollectionPointSchema,
  CreateOperatorParams,
} from '@/lib/server/api/endpoints';
import { databaseErrorHandler } from '@/lib/server/utils/error';

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

interface NewCollectionPointProps {
  defaultValues?: CreateCollectionPointParams;
  id?: string;
}

export function NewCollectionPoint({ defaultValues, id }: NewCollectionPointProps) {
  const [isDefaultAdded, setIsDefaultAdded] = useState(false);
  const form = useForm<CreateCollectionPointParams>({
    resolver: zodResolver(createCollectionPointSchema),
    defaultValues: defaultValues || {
      name: '',
      fullAddress: '',
    },
  });
  const router = useRouter();
  const { mutateAsync: createCollectionPoint, isLoading: isCreateLoading } =
    useCreateCollectionPoint();
  const { mutateAsync: updateCollectionPoint, isLoading: isUpdateLoading } =
    useUpdateCollectionPoint(id || '');

  const onSubmit = async (values: CreateCollectionPointParams) => {
    try {
      if (id) {
        await updateCollectionPoint(values);
      } else {
        await createCollectionPoint(values);
      }

      router.push(Routes.COLLECTION_POINTS);
    } catch (error) {
      const { isDbError, targets, message } = databaseErrorHandler(error as FetchError);

      if (isDbError) {
        for (const target of targets) {
          form.setError(target as FieldPath<CreateOperatorParams>, {
            type: 'custom',
            message: message,
          });
        }
      }
    }
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

  useEffect(() => {
    if (defaultValues && !isDefaultAdded) {
      form.reset();
      setIsDefaultAdded(true);
    }
  }, [defaultValues, form, isDefaultAdded]);

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
            description='Celem wyszukania lokalizacji wprowadź kompletny adres lub jego część np. miasto lub ulicę.'
          />
          <div className='flex w-full items-center justify-end'>
            <Button
              className='w-full md:w-auto'
              type='submit'
              isLoading={isCreateLoading || isUpdateLoading}
            >
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
