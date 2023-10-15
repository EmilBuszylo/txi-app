import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComboboxProps } from '@/components/ui/combobox';
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

export const MultiCombobox = ({
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
  const [open, setOpen] = useState(false);
  const { control, setValue, getValues } = useFormContext();
  const [options, setOptions] = useState(items);

  useEffect(() => {
    if (items) {
      setOptions(items);
    }
  }, [items]);

  return (
    <div className='relative'>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const displayValues = options.filter((opt) => field?.value?.includes(opt.value));

          return (
            <FormItem className='flex flex-col'>
              <FormLabel>{label}</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className={cn('h-auto w-full justify-between', {
                        'text-muted-foreground': !displayValues || !displayValues.length,
                      })}
                      disabled={isDisabled}
                      aria-readonly={isReadOnly}
                    >
                      <div className='flex flex-wrap items-center gap-x-2 gap-y-2'>
                        {displayValues.length > 0
                          ? displayValues.map((val) => (
                              <Badge key={val.value}>
                                {val.label}{' '}
                                <X
                                  className='h-4 w-4'
                                  onClick={() => {
                                    setValue(
                                      name,
                                      displayValues
                                        .filter((v) => v.value !== val.value)
                                        .map((el) => el.value)
                                    );
                                  }}
                                />
                              </Badge>
                            ))
                          : inputText}
                      </div>
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className='max-h-[405px] overflow-hidden p-0 md:w-[600px]'
                  side='bottom'
                  align='start'
                >
                  <Command className='w-full' shouldFilter={false}>
                    <CommandInput
                      placeholder={placeholder}
                      className='w-full'
                      disabled={isDisabled}
                      aria-readonly={isReadOnly}
                      readOnly={isReadOnly}
                      onValueChange={(el) => {
                        if (!el) {
                          setOptions(items);
                        } else {
                          setOptions(
                            items.filter((option) =>
                              option.label.toLowerCase().includes(el.toLowerCase())
                            )
                          );
                        }
                      }}
                    />
                    <CommandEmpty>{emptyStateMessage || 'Brak wyników'}</CommandEmpty>
                    <CommandGroup>
                      {options.map((item) => (
                        <CommandItem
                          value={item.value}
                          key={item.value}
                          onSelect={() => {
                            const values = getValues(name);
                            if (values && values.length > 0) {
                              if (values.includes(item.value)) {
                                setValue(
                                  name,
                                  (values as string[]).filter((v) => v !== item.value)
                                );
                              } else {
                                setValue(name, [...values, item.value]);
                              }
                            } else {
                              setValue(name, [item.value]);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value?.includes(item.value) ? 'opacity-100' : 'opacity-0'
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
