import { VisibilityState } from '@tanstack/react-table';
import { Column, Table } from '@tanstack/table-core';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ColumnVisibilityDropdown<TData>({
  table,
  columnVisibility,
}: {
  table: Table<TData>;
  columnVisibility: VisibilityState;
}) {
  const handleOnCheckedChange = (column: Column<TData, unknown>, isChecked: boolean) => {
    column.toggleVisibility(isChecked);
    let hiddenColumns = {};

    if (isChecked) {
      delete columnVisibility[column.id];
      hiddenColumns = {
        ...columnVisibility,
      };
    } else {
      hiddenColumns = {
        ...columnVisibility,
        [column.id]: false,
      };
    }

    localStorage.setItem(
      'ordersColumnsSettings',
      JSON.stringify({
        hiddenColumns,
      })
    );
    return;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='ml-auto'>
          Kolumny
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => handleOnCheckedChange(column, value)}
              >
                {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
