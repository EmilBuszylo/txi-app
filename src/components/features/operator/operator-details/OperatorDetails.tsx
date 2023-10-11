'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';

import { useOperator } from '@/lib/hooks/data/useOperator';

import { DetailsForm } from '@/components/features/operator/operator-details/DetailsForm';

export default function OperatorDetails() {
  const params = useParams();
  const { data, error, isLoading } = useOperator(params?.id);

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
        login: data.login,
        password: '',
        name: data.operator?.name || '',
      }}
      id={params?.id}
    />
  );
}
