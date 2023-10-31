'use client';

import { notFound, useParams } from 'next/navigation';

import { useOrder } from '@/lib/hooks/data/useOrder';

import { OrderDetailsForm } from '@/components/features/order/order-details/DetailsForm';

import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

export const OrderDetails = () => {
  const params = useParams();
  const { data, error, isLoading } = useOrder(params?.id);

  const isNoData = !isLoading && !data;

  if (isLoading) {
    return <>...loading</>;
  }

  if (!params?.id || error || isNoData) {
    return notFound();
  }

  if (!data) {
    return notFound();
  }

  const estimatedKm = (data.estimatedDistance || 0) + (data.wayBackDistance || 0);
  const kmForDriver = data?.kmForDriver || undefined;

  const stopTime = data.stopTime == 0 ? undefined : data.stopTime;
  const highwaysCost = data.highwaysCost == '0' ? undefined : data.highwaysCost;

  return (
    <OrderDetailsForm
      defaultValues={{
        ...data,
        collectionPointId: data.collectionPoint?.id,
        driverId: data.driver?.id,
        kmForDriver,
        estimatedKm: estimatedKm == 0 ? undefined : estimatedKm,
        operatorName: data.driver?.operatorName,
        intakeDistance: data.intakeDistance || undefined,
        updatedAt: data.updatedAt as unknown as string,
        distanceDifference: estimatedKm - (kmForDriver || 0),
        hasHighway: data.hasHighway,
        highwaysCost: highwaysCost || undefined,
        clientInvoice: data.clientInvoice || undefined,
        driverInvoice: data.driverInvoice || undefined,
        comment: data.comment || undefined,
        actualKm: data.actualKm || undefined,
        stopTime: stopTime || undefined,
        operatorNote: data.operatorNote || '',
      }}
      orderId={params?.id}
      collectionPoint={data.collectionPoint as CollectionPoint}
    />
  );
};
