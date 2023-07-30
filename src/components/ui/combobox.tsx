import { Check, ChevronsUpDown } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ComboboxProps {
  label: string;
  name: string;
  items: { label: string; value: string }[];
  placeholder?: string;
  inputText?: string;
  description?: string;
  emptyStateMessage?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export const Combobox = ({
  label,
  name,
  items,
  placeholder,
  inputText,
  description,
  emptyStateMessage,
  isDisabled,
  isReadOnly,
}: ComboboxProps) => {
  const { control, setValue } = useFormContext();

  return (
    <div className='relative'>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const displayValue = items.find((item) => item.value === field.value)?.label;

          return (
            <FormItem className='flex flex-col'>
              <FormLabel>{label}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-full justify-between',
                        !displayValue && 'text-muted-foreground'
                      )}
                      disabled={isDisabled}
                      aria-readonly={isReadOnly}
                    >
                      {displayValue || inputText}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='p-0 md:w-[600px]' side='bottom' align='start'>
                  <Command className='w-full'>
                    <CommandInput
                      placeholder={placeholder}
                      className='w-full'
                      disabled={isDisabled}
                      aria-readonly={isReadOnly}
                      readOnly={isReadOnly}
                    />
                    <CommandEmpty>{emptyStateMessage || 'Brak wyników'}</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          value={item.value}
                          key={item.value}
                          onSelect={() => {
                            setValue(name, item.value);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              item.value === field.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
