'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';

import { usePassenger } from '@/lib/hooks/data/usePassenger';

import { DetailsForm } from '@/components/features/passenger/passenger-details/DetailsForm';

export default function PassengerDetails() {
  const params = useParams();
  const { data, error, isLoading } = usePassenger(params?.id);

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
    <DetailsForm
      defaultValues={{
        name: data.name || '',
        phones: data.phones.map((phone) => ({ value: phone })),
        clients: data.clients.map((client) => client.id),
      }}
      id={params?.id}
    />
  );
}
