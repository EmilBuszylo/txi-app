import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { Operator } from '@/server/operators/operator';

export const ActionCell = ({ row }: { row: Row<Operator> }) => {
  const router = useRouter();
  return (
    <ActionsColumn>
      <DropdownMenuItem onClick={() => router.push(`${Routes.OPERATORS}/${row.original.id}`)}>
        Szczegóły/edycja
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </ActionsColumn>
  );
};
