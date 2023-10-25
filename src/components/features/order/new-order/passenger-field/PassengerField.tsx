import { PlusCircleIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { PassengerBlock } from '@/components/features/order/new-order/passenger-field/PassengerBlock';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PassengerField = ({ name }: { name: string }) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    name,
    control: control,
  });

  return (
    <div className='flex flex-col gap-y-2'>
      {fields.map((field, i) => (
        <div key={field.id}>
          <PassengerBlock i={i} name={name} remove={remove} />
          {fields.length > 1 && i + 1 != fields.length && (
            <div className='mt-4 w-full border-2 border-gray-200' />
          )}
        </div>
      ))}
      {fields.length <= 2 && (
        <div className='flex items-center gap-x-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='mt-2 w-fit'
                  onClick={() => {
                    append({ name: '', phone: '', type: 'list' });
                  }}
                >
                  Dodaj pasażera z listy
                  <PlusCircleIcon className='ml-1 h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Dodaj pasażera poprzez listę wyboru, która zawiera zapisanych w systemie pasażerów.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='mt-2 w-fit'
                  onClick={() => {
                    append({ name: '', phone: '', type: 'custom' });
                  }}
                >
                  Dodaj własnego pasażera
                  <PlusCircleIcon className='ml-1 h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Dodaj pasażera poprzez ręczne wprowadzenie jego danych takich jak imię bądź nr
                telefonu kontaktowego
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};
