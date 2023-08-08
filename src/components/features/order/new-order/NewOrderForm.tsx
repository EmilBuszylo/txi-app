'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useClients } from '@/lib/hooks/data/useClients';
import { useCollectionPoints } from '@/lib/hooks/data/useCollectionPoints';
import { useCreateOrder } from '@/lib/hooks/data/useCreateOrder';
import { useDrivers } from '@/lib/hooks/data/useDrivers';
import { CreateOrderParams, createOrderSchema } from '@/lib/server/api/endpoints';

import { EstimatedKmField } from '@/components/features/order/new-order/EstimatedKmField';
import { LocationFromSection } from '@/components/features/order/new-order/LocationFromSection';
import { LocationToSection } from '@/components/features/order/new-order/LocationToSection';
import { LocationViaSection } from '@/components/features/order/new-order/LocationViaSection/LocationViaSection';
import { ShowRouteButton } from '@/components/features/order/new-order/ShowRouteButton';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Routes } from '@/constant/routes';

export function NewOrderForm() {
  const form = useForm<CreateOrderParams>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      externalId: '',
      clientId: '',
      comment: '',
      collectionPointId: '',
      locationVia: [],
    },
  });
  const router = useRouter();

  const { data: drivers } = useDrivers({ page: 1, limit: 10000 });
  const { data: collectionPoints } = useCollectionPoints({ page: 1, limit: 1000 });
  const { data: clients } = useClients({ page: 1, limit: 1000 });

  const { mutateAsync: createOrder } = useCreateOrder();

  const onSubmit = async (values: CreateOrderParams) => {
    // eslint-disable-next-line no-console
    const collectionPointsGeoData = collectionPoints?.results.find(
      (res) => values.collectionPointId === res.id
    );
    const collectionPointLng = collectionPointsGeoData?.lng;
    const collectionPointLat = collectionPointsGeoData?.lat;
    await createOrder({
      ...values,
      collectionPointsGeoCodes:
        collectionPointLng && collectionPointLat
          ? { lng: collectionPointLng, lat: collectionPointLat }
          : undefined,
    });

    // TODO add error handling
    // if (!res) {
    //   console.error('error');
    // }

    router.push(Routes.ORDERS);
  };

  const driversData = drivers
    ? drivers.results.map((result) => ({
        value: result.id,
        label: `${result.firstName} ${result.lastName}`,
      }))
    : [];

  const collectionPointsData = collectionPoints
    ? collectionPoints.results.map((result) => ({
        value: result.id,
        label: result.fullAddress,
      }))
    : [];

  const clientsData = clients
    ? clients.results.map((result) => ({
        value: result.id,
        label: result.name,
      }))
    : [];

  return (
    <div className='lg:max-w-2xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Combobox
            label='Firma'
            name='clientId'
            items={clientsData}
            inputText='Wprowadź nazwę firmy'
          />
          <FormField
            control={form.control}
            name='externalId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr zlecenia</FormLabel>
                <FormControl>
                  <Input placeholder='Nr zlecenia' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Combobox
            label='Lokalizacja rozpoczęcia kursu'
            name='collectionPointId'
            items={collectionPointsData}
            inputText='Wprowadź lokalizację'
          />
          <LocationFromSection />
          <LocationViaSection />
          <LocationToSection />
          <ShowRouteButton />
          <EstimatedKmField />
          <Combobox
            label='Kierowca'
            name='driverId'
            items={driversData}
            inputText='Wprowadź nazwę kierowcy'
          />
          <FormField
            control={form.control}
            name='comment'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uwagi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Twoje uwagi do zlecenia'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
