import { PlusCircleIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdditionalPassengersFieldProps {
  name: string;
}

export const AdditionalPassengersField = ({ name }: AdditionalPassengersFieldProps) => {
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
          name={`${name}.${i}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn(i !== 0 && 'sr-only')}>Dodatkowi pasażerowie</FormLabel>
              <FormDescription className={cn(i !== 0 && 'sr-only')}>
                Dodaj dodatkowych pasażerów (nie więcej niż troje).
              </FormDescription>
              <FormControl>
                <div className='flex items-center justify-between gap-x-2'>
                  <Input {...field} className='flex-1' />
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
      {fields.length <= 2 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='mt-2'
                onClick={() => append({ name: '' })}
              >
                Dodaj pasażera <PlusCircleIcon className='ml-1 h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dodaj dodatkowych pasażerów</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
