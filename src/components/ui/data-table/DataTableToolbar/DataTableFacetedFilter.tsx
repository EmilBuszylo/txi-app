import { CheckIcon, PlusCircle } from 'lucide-react';
import { ComponentType, useMemo } from 'react';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  UseFiltersColumnFilters,
  UseFiltersMethods,
} from '@/components/ui/data-table/hooks/useFilters';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

interface DataTableFacetedFilterProps extends Omit<UseFiltersMethods, 'clearFilters'> {
  title?: string;
  name: string;
  columnFilters: UseFiltersColumnFilters;
  options: {
    label: string;
    value: string | number | boolean;
    icon?: ComponentType<{ className?: string }>;
  }[];
}

export const DataTableFacetedFilter = ({
  columnFilters,
  name,
  title,
  options,
  updateFilter,
  deleteFilter,
}: DataTableFacetedFilterProps) => {
  const selectedOption = useMemo(() => {
    const selectedValue = columnFilters.get(name);

    if (!selectedValue) return undefined;

    return options.find((option) => option.value === selectedValue);
  }, [columnFilters, name, options]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircle className='mr-2 h-4 w-4' />
          {title}
          {selectedOption && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <div className='hidden space-x-1 lg:flex'>
                {selectedOption && (
                  <Badge
                    variant='secondary'
                    key={selectedOption.label}
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedOption.label}
                  </Badge>
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                return (
                  <CommandItem
                    key={option.label}
                    onSelect={() => {
                      if (selectedOption?.value === option.value) {
                        deleteFilter(name);
                      } else {
                        updateFilter(name, option.value);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedOption?.value === option.value
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedOption && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => deleteFilter(name)}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
