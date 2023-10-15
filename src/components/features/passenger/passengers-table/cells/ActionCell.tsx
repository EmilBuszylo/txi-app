import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { useRemovePassenger } from '@/lib/hooks/data/useRemovePassenger';
import { GetPassengersParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { Passenger } from '@/server/passengers/passenger';

export const ActionCell = ({
  row,
  params,
}: {
  row: Row<Passenger>;
  params: GetPassengersParams;
}) => {
  const { mutateAsync: removePassengerHandler } = useRemovePassenger(row.original.id, params);

  const router = useRouter();
  return (
    <ActionsColumn>
      <DropdownMenuItem onClick={() => router.push(`${Routes.PASSENGERS}/${row.original.id}`)}>
        Szczegóły/edycja
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {!row.original.deletedAt && (
        <DropdownMenuItem onClick={() => removePassengerHandler()} className='text-destructive'>
          Usuń pasażera
        </DropdownMenuItem>
      )}
    </ActionsColumn>
  );
};
