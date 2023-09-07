import { X, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UseFiltersColumnFilters,
  UseFiltersMethods,
} from '@/components/ui/data-table/hooks/useFilters';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface DataTableTextFilterProps extends Omit<UseFiltersMethods, 'clearFilters'> {
  title?: string;
  name: string;
  columnFilters: UseFiltersColumnFilters;
}

export const DataTableTextFilter = ({
  columnFilters,
  name,
  title,
  updateFilter,
  deleteFilter,
}: DataTableTextFilterProps) => {
  const [inputValue, setInputValue] = useState('');
  const providedValue = useMemo(() => {
    const value = columnFilters.get(name);

    if (!value) return undefined;

    return value.toString();
  }, [columnFilters, name]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-8 justify-start border-dashed lg:justify-center'
        >
          {title}
          {providedValue && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <div className='flex items-center gap-x-1 space-x-1'>
                {providedValue && (
                  <Badge
                    variant='secondary'
                    key={providedValue}
                    className=' rounded-sm px-1 font-normal'
                  >
                    {providedValue}
                  </Badge>
                )}
                <Separator orientation='vertical' className='mx-2 h-4' />
                <XCircle
                  className='z-20 h-4 w-4 transition hover:opacity-30'
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteFilter(name);
                  }}
                />
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full max-w-[360px] p-0' align='start'>
        <div className='flex w-full items-center gap-x-2 overflow-hidden rounded-md bg-popover p-4 text-popover-foreground'>
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Button
            className='w-fit'
            variant='default'
            onClick={() => {
              if (providedValue === inputValue) {
                deleteFilter(name);
                setInputValue('');
              } else {
                updateFilter(name, inputValue);
              }
            }}
          >
            {providedValue === inputValue ? <X className='h-4 w-4' /> : 'Filtruj'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
