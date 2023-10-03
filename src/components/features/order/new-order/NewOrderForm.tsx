'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { FetchError } from '@/lib/helpers/fetch-json';
import { useClients } from '@/lib/hooks/data/useClients';
import { useCollectionPoints } from '@/lib/hooks/data/useCollectionPoints';
import { useCreateOrder } from '@/lib/hooks/data/useCreateOrder';
import { useDrivers } from '@/lib/hooks/data/useDrivers';
import { UseIsClientRole } from '@/lib/hooks/useIsClientRole';
import {
  createOrderByClientSchema,
  CreateOrderParams,
  createOrderSchema,
} from '@/lib/server/api/endpoints';
import { databaseErrorHandler } from '@/lib/server/utils/error';

import { EstimatedKmField } from '@/components/features/order/new-order/EstimatedKmField';
import { useValidateLocationDate } from '@/components/features/order/new-order/hooks/useValidateLocationDate';
import { LocationFromSection } from '@/components/features/order/new-order/LocationFromSection';
import { LocationToSection } from '@/components/features/order/new-order/LocationToSection';
import { LocationViaSection } from '@/components/features/order/new-order/LocationViaSection/LocationViaSection';
import { ShowRouteButton } from '@/components/features/order/new-order/ShowRouteButton';
import { HideForClientRoleWrapper } from '@/components/HideForClientRoleWrapper';
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
  const { clientId, isClient } = UseIsClientRole();
  const form = useForm<CreateOrderParams>({
    resolver: zodResolver(isClient ? createOrderByClientSchema : createOrderSchema),
    defaultValues: {
      externalId: '',
      clientId: clientId || undefined,
      comment: undefined,
      collectionPointId: undefined,
      locationVia: [],
      locationFrom: {
        date: '',
        passenger: {
          name: undefined,
          phone: undefined,
        },
      },
      locationTo: {
        date: '',
      },
    },
    shouldUseNativeValidation: false,
  });
  const router = useRouter();

  const { data: drivers } = useDrivers({ page: 1, limit: 10000 });
  const { data: collectionPoints } = useCollectionPoints({ page: 1, limit: 1000 });
  const { data: clients } = useClients({ page: 1, limit: 1000 });

  const { mutateAsync: createOrder, isLoading } = useCreateOrder();

  //  responsible for locations date field validation
  const { setLocationDateError } = useValidateLocationDate(form, isClient);
  const errorsCount = Object.keys(form.formState.errors).length;
  useEffect(() => {
    if (errorsCount > 0) {
      setLocationDateError();
    }
  }, [errorsCount, setLocationDateError]);

  const onSubmit = async (values: CreateOrderParams) => {
    const isLocationDateError = setLocationDateError();

    if (isLocationDateError) {
      return;
    }

    // eslint-disable-next-line no-console
    const collectionPointsGeoData = collectionPoints?.results.find(
      (res) => values.collectionPointId === res.id
    );
    const collectionPointLng = collectionPointsGeoData?.lng;
    const collectionPointLat = collectionPointsGeoData?.lat;
    try {
      await createOrder({
        ...values,
        collectionPointsGeoCodes:
          collectionPointLng && collectionPointLat
            ? { lng: collectionPointLng, lat: collectionPointLat }
            : undefined,
      });

      router.push(Routes.ORDERS);
    } catch (error) {
      const { isDbError, targets, message } = databaseErrorHandler(error as FetchError);

      if (isDbError) {
        for (const target of targets) {
          form.setError(target as FieldPath<CreateOrderParams>, {
            type: 'custom',
            message: message,
          });
        }
      }
    }
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
        label: `${result.name} - ${result.fullAddress}`,
      }))
    : [];

  const clientsData = clients
    ? clients.results.map((result) => ({
        value: result.id,
        label: result.name,
      }))
    : [];

  const driverId = form.watch('driverId');

  const operator = useMemo(() => {
    return drivers?.results.find((res) => res.id === driverId)?.operatorName;
  }, [driverId, drivers?.results]);

  return (
    <div className='lg:max-w-2xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Combobox
            label='Firma'
            name='clientId'
            items={clientsData}
            inputText='Wprowadź nazwę firmy'
            isDisabled={isClient}
          />
          <FormField
            control={form.control}
            name='externalId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isClient ? 'Nr zlecenia' : 'Nr zlecenia klienta'}</FormLabel>
                <FormControl>
                  <Input placeholder='Nr zlecenia' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <HideForClientRoleWrapper>
            <Combobox
              label='Kierowca'
              name='driverId'
              items={driversData}
              inputText='Wprowadź nazwę kierowcy'
            />
          </HideForClientRoleWrapper>
          <HideForClientRoleWrapper>
            <div className='flex flex-col space-y-2'>
              <FormLabel>Operator</FormLabel>
              <FormControl>
                <Input disabled value={operator || ''} />
              </FormControl>
              <FormMessage />
            </div>
          </HideForClientRoleWrapper>
          <HideForClientRoleWrapper>
            <Combobox
              label='Lokalizacja rozpoczęcia kursu'
              name='collectionPointId'
              items={collectionPointsData}
              inputText='Wprowadź lokalizację'
            />
          </HideForClientRoleWrapper>
          <LocationFromSection isClient={isClient} />
          <LocationViaSection isClient={isClient} />
          <LocationToSection isClient={isClient} />
          <ShowRouteButton />
          <HideForClientRoleWrapper>
            <EstimatedKmField />
          </HideForClientRoleWrapper>
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
            <Button className='w-full md:w-auto' type='submit' isLoading={isLoading}>
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
