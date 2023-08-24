'use client';

import { notFound, useParams } from 'next/navigation';

import { useCollectionPoint } from '@/lib/hooks/data/useCollectionPoint';

import { NewCollectionPoint } from '@/components/features/collection-points/NewCollectionPoint/NewCollectionPoint';

export const CollectionPointDetails = () => {
  const params = useParams();
  const { data, error, isLoading } = useCollectionPoint(params?.id);

  const isNoData = !isLoading && !data;

  if (isLoading) {
    return <>...loading</>;
  }

  if (!params?.id || error || isNoData) {
    return notFound();
  }

  return <NewCollectionPoint defaultValues={data} id={params?.id} />;
};
