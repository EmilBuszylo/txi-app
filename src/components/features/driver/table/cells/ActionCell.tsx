import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { useRemoveDriver } from '@/lib/hooks/data/useRemoveDriver';
import { GetDriversParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { Driver } from '@/server/drivers/driver';

export const ActionCell = ({ row, params }: { row: Row<Driver>; params: GetDriversParams }) => {
  const { mutateAsync: removeDriverHandler } = useRemoveDriver(row.original.id, params);
  const router = useRouter();
  return (
    <ActionsColumn>
      <DropdownMenuItem onClick={() => router.push(`${Routes.DRIVERS}/${row.original.id}`)}>
        Szczegóły/edycja
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {!row.original.deletedAt && (
        <DropdownMenuItem onClick={() => removeDriverHandler()} className='text-destructive'>
          Usuń kierowcę
        </DropdownMenuItem>
      )}
    </ActionsColumn>
  );
};
