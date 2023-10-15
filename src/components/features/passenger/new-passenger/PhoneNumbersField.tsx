import { PlusCircleIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface PhoneNumbersFieldProps {
  name: string;
}

export const PhoneNumbersField = ({ name }: PhoneNumbersFieldProps) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name,
    control: control,
  });

  return (
    <div>
      {fields.map((field, i) => (
        <FormField
          control={control}
          key={field.id}
          name={`${name}.${i}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(i !== 0 && 'sr-only')}>Numery kontaktowe</FormLabel>
              <FormDescription className={cn(i !== 0 && 'sr-only')}>
                Podaj numer kontaktowy do pasażera
              </FormDescription>
              <FormControl>
                <div className='flex items-center justify-between gap-x-2'>
                  <PatternFormat
                    format='+48 ### ### ###'
                    customInput={Input}
                    {...field}
                    placeholder='Numer kontaktowy pasażera'
                  />
                  <Button variant='ghost' onClick={() => remove(i)}>
                    <Trash2 className='h-4 w-4 text-destructive' />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      {fields.length === 0 && (
        <div className='space-y-2'>
          <FormLabel>Numery kontaktowe</FormLabel>
          <FormDescription>Dodaj jeden lub więcej numerów kontaktowych do pasażera</FormDescription>
        </div>
      )}
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='mt-2'
        onClick={() => append({ name: '' })}
      >
        Dodaj numer <PlusCircleIcon className='ml-1 h-4 w-4' />
      </Button>
    </div>
  );
};
