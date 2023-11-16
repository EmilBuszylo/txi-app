import { useRouter, useSearchParams } from 'next/navigation';
import { User } from 'next-auth';
import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { UseFormHandleSubmit } from 'react-hook-form/dist/types/form';

import { FetchError } from '@/lib/helpers/fetch-json';
import { useResendOrderEmail } from '@/lib/hooks/data/useResendOrderEmail';
import { useUpdateOrder } from '@/lib/hooks/data/useUpdateOrder';
import { getCurrentQueryParams } from '@/lib/queryParams';
import { CreateOrderParams, UpdateOrderParams } from '@/lib/server/api/endpoints';
import { databaseErrorHandler } from '@/lib/server/utils/error';

import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import { Routes } from '@/constant/routes';
import { GetCollectionPointsResponse } from '@/server/collection-points.ts/collection-points.service';

export const SaveAndSendButton = ({
  orderId,
  setLocationDateError,
  collectionPoints,
  user,
  handleSubmit,
}: {
  orderId: string;
  setLocationDateError: () => boolean | undefined;
  collectionPoints?: GetCollectionPointsResponse;
  user: User;
  handleSubmit: UseFormHandleSubmit<OrderDetailsFormDefaultValues>;
}) => {
  const { toast } = useToast();
  const { setError } = useForm();
  const { mutateAsync: updateOrder, isLoading, isSuccess } = useUpdateOrder(orderId);
  const { mutateAsync: resendEmail } = useResendOrderEmail();
  const router = useRouter();
  const searchParams = useSearchParams();

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

    try {
      const order = await updateOrder({
        ...values,
        kmForDriver,
        actualKm,
        stopTime,
        collectionPointsGeoCodes:
          collectionPointLng && collectionPointLat
            ? { lng: collectionPointLng, lat: collectionPointLat }
            : undefined,
        editedBy: user,
      });

      const params = getCurrentQueryParams(searchParams, [], {});

      router.push(`${Routes.ORDERS}?${params}`);

      await resendEmail({ subject: `Zlecenie ${order.internalId} ${order.clientName}`, order });
    } catch (error) {
      const { isDbError, targets, message } = databaseErrorHandler(error as FetchError);

      if (isDbError) {
        for (const target of targets) {
          setError(target as FieldPath<CreateOrderParams>, {
            type: 'custom',
            message: message,
          });
        }
      } else {
        toast({
          description: 'Wystąpił nieoczekiwany błąd serwera, prosimy spróbować ponownie później',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Button
      className='w-full md:w-auto'
      type='submit'
      onClick={handleSubmit(onSubmit)}
      isLoading={isLoading || isSuccess}
    >
      Zapisz i wyślij
    </Button>
  );
};
