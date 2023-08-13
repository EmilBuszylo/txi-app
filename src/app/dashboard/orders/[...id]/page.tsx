'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';

import { useOrder } from '@/lib/hooks/data/useOrder';

import { OrderDetailsForm } from '@/components/features/order/order-details/DetailsForm';

import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

export default function OrderDetails() {
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

  return (
    <OrderDetailsForm
      defaultValues={{
        ...data,
        collectionPointId: data.collectionPoint?.id,
        driverId: data.driver?.id,
        kmForDriver: data.kmForDriver || 0,
        estimatedKm: (data.estimatedDistance || 0) + (data.wayBackDistance || 0),
        operatorName: data.driver?.operatorName,
      }}
      orderId={params?.id}
      collectionPoint={data.collectionPoint as CollectionPoint}
    />
  );
}
