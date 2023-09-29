import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { useRemoveCollectionPoint } from '@/lib/hooks/data/useRemoveCollectionPoint';
import { GetCollectionPointsParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

export const ActionCell = ({
  row,
  params,
}: {
  row: Row<CollectionPoint>;
  params: GetCollectionPointsParams;
}) => {
  const { mutateAsync: removeCollectionPoint } = useRemoveCollectionPoint(row.original.id, params);
  const router = useRouter();
  return (
    <ActionsColumn>
      <DropdownMenuItem
        onClick={() => router.push(`${Routes.COLLECTION_POINTS}/${row.original.id}`)}
      >
        Szczegóły/edycja
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {!row.original.deletedAt && (
        <DropdownMenuItem onClick={() => removeCollectionPoint()} className='text-destructive'>
          Usuń lokalizacje
        </DropdownMenuItem>
      )}
    </ActionsColumn>
  );
};
