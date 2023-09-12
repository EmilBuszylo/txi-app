'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useClients } from '@/lib/hooks/data/useClients';
import { useCollectionPoints } from '@/lib/hooks/data/useCollectionPoints';
import { useDrivers } from '@/lib/hooks/data/useDrivers';
import { useUpdateOrder } from '@/lib/hooks/data/useUpdateOrder';
import { UseIsDispatcherRole } from '@/lib/hooks/useIsDispatcherRole';
import { UpdateOrderParams, updateOrderSchema } from '@/lib/server/api/endpoints';
import { cn } from '@/lib/utils';

import { EstimatedKmField } from '@/components/features/order/new-order/EstimatedKmField';
import { useValidateLocationDate } from '@/components/features/order/new-order/hooks/useValidateLocationDate';
import { LocationFromSection } from '@/components/features/order/new-order/LocationFromSection';
import { LocationToSection } from '@/components/features/order/new-order/LocationToSection';
import { LocationViaSection } from '@/components/features/order/new-order/LocationViaSection/LocationViaSection';
import { ShowRouteButton } from '@/components/features/order/new-order/ShowRouteButton';
import { statusLabelPerStatus } from '@/components/features/order/utils';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Routes } from '@/constant/routes';
import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';
import { OrderStatus } from '@/server/orders/order';

interface OrderDetailsFormProps {
  defaultValues: OrderDetailsFormDefaultValues;
  orderId: string;
  collectionPoint?: CollectionPoint;
  operatorName?: string;
}

export interface OrderDetailsFormDefaultValues extends UpdateOrderParams {
  estimatedKm?: number;
  hasHighway?: boolean;
  operatorName?: string;
  intakeDistance?: number;
  internalId: string;
  distanceDifference: number;
  updatedAt?: string;
}

export function OrderDetailsForm({
  defaultValues,
  orderId,
  collectionPoint,
}: OrderDetailsFormProps) {
  const [isDefaultAdded, setIsDefaultAdded] = useState(false);
  const { isDispatcher } = UseIsDispatcherRole();
  const form = useForm<OrderDetailsFormDefaultValues>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: defaultValues,
  });
  const router = useRouter();
  //  responsible for locations date field validation
  const { setLocationDateError } = useValidateLocationDate(form, false);

  const errorsCount = Object.keys(form.formState.errors).length;
  useEffect(() => {
    if (errorsCount > 0) {
      setLocationDateError();
    }
  }, [errorsCount, setLocationDateError]);

  const { data: drivers } = useDrivers({ page: 1, limit: 10000 });
  const { data: collectionPoints } = useCollectionPoints({ page: 1, limit: 1000 });
  const { data: clients } = useClients({ page: 1, limit: 1000 });

  const { mutateAsync: updateOrder, isLoading } = useUpdateOrder(orderId);

  useEffect(() => {
    if (defaultValues && !isDefaultAdded) {
      form.reset();
      setIsDefaultAdded(true);
    }
  }, [defaultValues, form, isDefaultAdded]);

  const onSubmit = async (values: UpdateOrderParams) => {
    const isLocationDateError = setLocationDateError();

    if (isLocationDateError) {
      return;
    }

    const collectionPointsGeoData = collectionPoints?.results.find(
      (res) => values.collectionPointId === res.id
    );
    const collectionPointLng = collectionPointsGeoData?.lng;
    const collectionPointLat = collectionPointsGeoData?.lat;

    const kmForDriver = values.kmForDriver ? Number(values.kmForDriver) : undefined;
    const actualKm = values.actualKm ? Number(values.actualKm) : undefined;
    const stopTime = values.stopTime ? Number(values.stopTime) : undefined;

    await updateOrder({
      ...values,
      kmForDriver,
      actualKm,
      stopTime,
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

  const driversData = useMemo(() => {
    return drivers
      ? drivers.results.map((result) => ({
          value: result.id,
          label: `${result.firstName} ${result.lastName}`,
        }))
      : [];
  }, [drivers]);

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

  const driverId = form.watch('driverId');

  const operator = useMemo(() => {
    return drivers?.results.find((res) => res.id === driverId)?.operatorName;
  }, [driverId, drivers?.results]);

  return (
    <div className='lg:max-w-2xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={(e) => field.onChange(e as OrderStatus)}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(OrderStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabelPerStatus[status as OrderStatus]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='internalId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr TXI</FormLabel>
                <FormControl>
                  <Input placeholder='Nr zlecenia' {...field} disabled readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='externalId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr zlecenia</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Nr zlecenia'
                    {...field}
                    disabled={isDispatcher}
                    readOnly={isDispatcher}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Combobox
            label='Firma'
            name='clientId'
            items={clientsData}
            inputText='Wprowadź nazwę firmy'
          />
          <div className='flex flex-col space-y-2'>
            <FormLabel>Operator</FormLabel>
            <FormControl>
              <Input disabled value={operator || ''} />
            </FormControl>
            <FormMessage />
          </div>
          <Combobox
            label='Kierowca'
            name='driverId'
            items={driversData}
            inputText='Wprowadź nazwę kierowcy'
          />
          <Combobox
            label='Lokalizacja rozpoczęcia kursu'
            name='collectionPointId'
            items={collectionPointsData}
            inputText='Wprowadź lokalizację'
          />
          <FormField
            control={form.control}
            name='clientInvoice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr faktury klienta</FormLabel>
                <FormControl>
                  <Input
                    placeholder='podaj nr faktury klienta'
                    {...field}
                    disabled={isDispatcher}
                    readOnly={isDispatcher}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='driverInvoice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nr faktury kierowcy</FormLabel>
                <FormControl>
                  <Input
                    placeholder='podaj nr faktury kierowcy'
                    {...field}
                    disabled={isDispatcher}
                    readOnly={isDispatcher}
                  />
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
                  <Checkbox
                    checked={field.value}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                    disabled={isDispatcher}
                    readOnly={isDispatcher}
                    className={cn({ 'opacity-40': isDispatcher })}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel className={cn({ 'opacity-40': isDispatcher })}>
                    Czy klient opłacił fakturę?
                  </FormLabel>
                  <FormDescription>
                    Zaznacz powyższe pole w przypadku gdy klient uregulował fakturę za zlecony kurs.
                  </FormDescription>
                </div>
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
          <LocationFromSection
            defaultMapUrl={defaultValues?.locationFrom?.address.url}
            isClient={false}
          />
          <LocationViaSection
            isClient={false}
            defaultMapUrls={defaultValues.locationVia?.map((l) => l.address.url)}
          />
          <LocationToSection
            defaultMapUrl={defaultValues?.locationTo?.address.url}
            isClient={false}
          />
          <ShowRouteButton />
          <EstimatedKmField
            defaultCollectionPointsGeo={
              collectionPoint?.lat && collectionPoint.lng
                ? { lat: collectionPoint.lat, lng: collectionPoint.lng }
                : undefined
            }
          />
          {!isDispatcher && (
            <FormField
              control={form.control}
              name='stopTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Czas oczekiwania</FormLabel>
                  <FormControl>
                    <Input placeholder='Podaj łączny czas oczekiwania' {...field} type='number' />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Czas oczekiwania wyrażony w pełnych godzinach</FormDescription>
                </FormItem>
              )}
            />
          )}
          {!isDispatcher && (
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
          )}
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
            name='distanceDifference'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rozbieżność</FormLabel>
                <FormControl>
                  <Input {...field} type='number' disabled readOnly />
                </FormControl>
                <FormMessage />
                <FormDescription>Różnica między km szacowanymi a km dla kierowcy.</FormDescription>
              </FormItem>
            )}
          />
          {!isDispatcher && (
            <FormField
              control={form.control}
              name='isKmDifferenceAccepted'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Czy zaakceptowano różnice w km</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name='hasHighway'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                    disabled
                    readOnly
                    className='opacity-40'
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel className='opacity-40'>
                    Czy trasa przebiega przez drogę płatną (Autostrada)?
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='highwaysCost'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Koszt płatnych odcinków</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Podaj koszt płatnych odcinków'
                    {...field}
                    onKeyDown={(event) => {
                      if (
                        !/[0-9]/.test(event.key) &&
                        !['ArrowLeft', 'ArrowRight', 'Backspace'].includes(event.key)
                      ) {
                        event.preventDefault();
                      }
                    }}
                    type='text'
                    onChange={(e) => {
                      const newVal = e?.target?.value
                        ? e.target.value.replaceAll(',', '').replaceAll(' ', '')
                        : 0;

                      field.onChange(Number(newVal).toLocaleString());
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='intakeDistance'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dolot</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Dolot do początku trasy'
                    {...field}
                    type='number'
                    readOnly
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='updatedAt'
            render={({ field }) => {
              let value = undefined;

              if (field?.value) {
                const dt = new Date(field.value);
                dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
                value = dt.toISOString().slice(0, 16);
              }

              return (
                <FormItem className='flex flex-col items-start'>
                  <FormLabel>Data modyfikacji</FormLabel>
                  <Input {...field} value={value} type='datetime-local' readOnly disabled />
                  <FormMessage />
                </FormItem>
              );
            }}
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
