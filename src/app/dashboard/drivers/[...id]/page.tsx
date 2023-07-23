'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';

import { useDriver } from '@/lib/hooks/data/useDriver';

import { DetailForm } from '@/components/features/driver/driver-details/DetailsForm';

export default function CollectionPointDetails() {
  const params = useParams();
  const { data, error, isLoading } = useDriver(params?.id);

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
    <DetailForm
      defaultValues={{
        login: data.login,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        car: data.driverDetails
          ? {
              carModel: data.driverDetails.carModel || '',
              carBrand: data.driverDetails.carBrand || '',
              carColor: data.driverDetails.carColor || '',
              carRegistrationNumber: data.driverDetails.carRegistrationNumber || '',
            }
          : undefined,
      }}
      id={params?.id}
    />
  );
}
