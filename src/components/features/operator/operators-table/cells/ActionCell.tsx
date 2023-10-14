import { Row } from '@tanstack/table-core';
import { useRouter } from 'next/navigation';

import { useRemoveOperator } from '@/lib/hooks/data/useRemoveOperator';
import { GetOperatorsParams } from '@/lib/server/api/endpoints';

import { ActionsColumn } from '@/components/ui/data-table/columns/ActionsColumn';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Routes } from '@/constant/routes';
import { Operator } from '@/server/operators/operator';

export const ActionCell = ({ row, params }: { row: Row<Operator>; params: GetOperatorsParams }) => {
  const { mutateAsync: removeOperatorHandler } = useRemoveOperator(row.original.id, params);

  const router = useRouter();
  return (
    <ActionsColumn>
      <DropdownMenuItem onClick={() => router.push(`${Routes.OPERATORS}/${row.original.id}`)}>
        Szczegóły/edycja
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      {!row.original.deletedAt && (
        <DropdownMenuItem onClick={() => removeOperatorHandler()} className='text-destructive'>
          Usuń operatora
        </DropdownMenuItem>
      )}
    </ActionsColumn>
  );
};
