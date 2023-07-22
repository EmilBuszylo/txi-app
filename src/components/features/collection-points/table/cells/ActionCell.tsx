import { Row } from '@tanstack/table-core';

import { useRemoveCollectionPoint } from '@/lib/hooks/data/useRemoveCollectionPoint';
import { GetCollectionPointsParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';

export const ActionCell = ({
  row,
  params,
}: {
  row: Row<CollectionPoint>;
  params: GetCollectionPointsParams;
}) => {
  const { mutateAsync: removeCollectionPoint } = useRemoveCollectionPoint(row.original.id, params);
  return (
    <ActionsColumn>
      <DropdownMenuItem>Szczegóły/edycja</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => removeCollectionPoint()} className='text-destructive'>
        Usuń lokalizacje
      </DropdownMenuItem>
    </ActionsColumn>
  );
};
