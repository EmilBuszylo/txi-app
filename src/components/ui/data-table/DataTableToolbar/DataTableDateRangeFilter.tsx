import { XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';

import { formatDate } from '@/lib/helpers/date';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UseFiltersColumnFilters,
  UseFiltersMethods,
} from '@/components/ui/data-table/hooks/useFilters';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { dateFormats } from '@/constant/date-formats';

interface DataTableDateRangeFilterProps extends Omit<UseFiltersMethods, 'clearFilters'> {
  title?: string;
  name: string;
  columnFilters: UseFiltersColumnFilters;
}

export const DataTableDateRangeFilter = ({
  columnFilters,
  name,
  title,
  updateFilter,
  deleteFilter,
}: DataTableDateRangeFilterProps) => {
  const [inputToValue, setInputToValue] = useState('');
  const [inputFromValue, setInputFromValue] = useState('');
  const providedValue = useMemo(() => {
    const valueFrom = columnFilters.get(`${name}From`) as string;
    const valueTo = columnFilters.get(`${name}To`) as string;

    if (!valueFrom || !valueTo) return undefined;

    return { valueFrom, valueTo };
  }, [columnFilters, name]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='h-full min-h-[2rem] flex-col justify-center gap-y-2 border-dashed lg:h-8 lg:flex-row'
        >
          {title}
          {providedValue && (
            <>
              <Separator orientation='vertical' className='mx-2 hidden h-4 lg:block' />
              <div className='flex flex-col items-center gap-x-1 gap-y-2 space-x-1 lg:flex-row'>
                {Object.keys(providedValue).map((k) => (
                  <Badge key={k} variant='secondary' className=' rounded-sm px-1 font-normal'>
                    {k === 'valueFrom' ? 'Od: ' : 'Do: '}
                    {formatDate(
                      new Date(providedValue[k as keyof typeof providedValue]),
                      dateFormats.dateWithTimeFull
                    )}
                  </Badge>
                ))}
                <Separator orientation='vertical' className='mx-2 hidden h-4 lg:block' />
                <XCircle
                  className='z-20 h-6 w-6 transition hover:opacity-30 lg:h-4 lg:w-4'
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteFilter(`${name}From`);
                    deleteFilter(`${name}To`);
                  }}
                />
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full max-w-[360px] p-0' align='start'>
        <div className='flex w-full flex-col items-end gap-y-4 overflow-hidden rounded-md bg-popover p-4 text-popover-foreground'>
          <Input
            placeholder='Wprowadź datę od'
            name={`${name}.from`}
            type='datetime-local'
            onChange={(e) => setInputFromValue(e.target.value)}
          />
          <Input
            placeholder='Wprowadź datę do'
            name={`${name}.to`}
            type='datetime-local'
            onChange={(e) => setInputToValue(e.target.value)}
          />
          <Button
            className='w-fit'
            variant='default'
            onClick={() => {
              if (
                providedValue?.valueTo === inputToValue &&
                providedValue?.valueFrom === inputFromValue
              ) {
                deleteFilter(name);
                deleteFilter(name);
                setInputFromValue(`${name}From`);
                setInputToValue(`${name}To`);
              } else {
                updateFilter(`${name}From`, inputFromValue);
                updateFilter(`${name}To`, inputToValue);
              }
            }}
          >
            Filtruj
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
