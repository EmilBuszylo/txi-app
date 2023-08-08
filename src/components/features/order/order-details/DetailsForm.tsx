'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useClients } from '@/lib/hooks/data/useClients';
import { useCollectionPoints } from '@/lib/hooks/data/useCollectionPoints';
import { useDrivers } from '@/lib/hooks/data/useDrivers';
import { useUpdateOrder } from '@/lib/hooks/data/useUpdateOrder';
import { UpdateOrderParams, updateOrderSchema } from '@/lib/server/api/endpoints';

import { EstimatedKmField } from '@/components/features/order/new-order/EstimatedKmField';
import { LocationFromSection } from '@/components/features/order/new-order/LocationFromSection';
import { LocationToSection } from '@/components/features/order/new-order/LocationToSection';
import { LocationViaSection } from '@/components/features/order/new-order/LocationViaSection/LocationViaSection';
import { ShowRouteButton } from '@/components/features/order/new-order/ShowRouteButton';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox } from '@/components/ui/combobox';
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
import { Textarea } from '@/components/ui/textarea';

import { Routes } from '@/constant/routes';
import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

interface OrderDetailsFormProps {
  defaultValues: OrderDetailsFormDefaultValues;
  orderId: string;
  collectionPoint?: CollectionPoint;
}

export interface OrderDetailsFormDefaultValues extends UpdateOrderParams {
  estimatedKm?: number;
  hasHighway?: boolean;
}

export function OrderDetailsForm({
  defaultValues,
  orderId,
  collectionPoint,
}: OrderDetailsFormProps) {
  const form = useForm<OrderDetailsFormDefaultValues>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: defaultValues,
  });
  const router = useRouter();

  const { data: drivers } = useDrivers({ page: 1, limit: 10000 });
  const { data: collectionPoints } = useCollectionPoints({ page: 1, limit: 1000 });
  const { data: clients } = useClients({ page: 1, limit: 1000 });

  const { mutateAsync: updateOrder } = useUpdateOrder(orderId);

  useEffect(() => {
    if (defaultValues) {
      form.reset();
    }
  }, [defaultValues, form]);

  const onSubmit = async (values: UpdateOrderParams) => {
    // eslint-disable-next-line no-console
    const collectionPointsGeoData = collectionPoints?.results.find(
      (res) => values.collectionPointId === res.id
    );
    const collectionPointLng = collectionPointsGeoData?.lng;
    const collectionPointLat = collectionPointsGeoData?.lat;
    await updateOrder({
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
          <LocationFromSection defaultMapUrl={defaultValues.locationFrom.address.url} />
          <LocationViaSection
            defaultMapUrls={defaultValues.locationVia?.map((l) => l.address.url)}
          />
          <LocationToSection defaultMapUrl={defaultValues.locationTo.address.url} />
          <ShowRouteButton />
          <Combobox
            label='Kierowca'
            name='driverId'
            items={driversData}
            inputText='Wprowadź nazwę kierowcy'
          />
          <FormField
            control={form.control}
            name='clientInvoice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr faktury klienta</FormLabel>
                <FormControl>
                  <Input placeholder='podaj nr faktury klienta' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='clientInvoice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr faktury kierowcy</FormLabel>
                <FormControl>
                  <Input placeholder='podaj nr faktury kierowcy' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isPayed'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/*@ts-ignore*/}
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>Czy klient opłacił fakturę?</FormLabel>
                  <FormDescription>
                    Zaznacz powyższe pole w przypadku gdy klient uregulował fakturę za zlecony kurs.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <EstimatedKmField
            defaultCollectionPointsGeo={
              collectionPoint?.lat && collectionPoint.lng
                ? { lat: collectionPoint.lat, lng: collectionPoint.lng }
                : undefined
            }
          />
          <FormField
            control={form.control}
            name='actualKm'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Km rzeczywiste</FormLabel>
                <FormControl>
                  <Input placeholder='Podaj rzeczywiste km' {...field} type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='kmForDriver'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Km dla kierowcy</FormLabel>
                <FormControl>
                  <Input placeholder='Podaj km dla kierwocy' {...field} type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
                <FormDescription>Uwagi (np. preferowany punkt zborny)</FormDescription>
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
