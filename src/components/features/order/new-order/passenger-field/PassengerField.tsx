import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { usePassengers } from '@/lib/hooks/data/usePassengers';
import { UseIsClientRole } from '@/lib/hooks/useIsClientRole';

import { PassengerBlock } from '@/components/features/order/new-order/passenger-field/PassengerBlock';
import { Button } from '@/components/ui/button';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PassengerField = ({ name }: { name: string }) => {
  const { control, formState, setError } = useFormContext();
  const { clientId } = UseIsClientRole();
  const [isTooSmallErr, setTooSmallErr] = useState('');

  const clientFieldValue = useWatch({
    control,
    name: 'clientId',
  });

  const currentClient = clientId || clientFieldValue;

  const { fields, append, remove } = useFieldArray({
    name,
    control: control,
  });

  // TODO run this query only once when the view is loaded
  const { data: passengers } = usePassengers({
    page: 1,
    limit: 1000,
    clientId: currentClient,
  });

  const passengersData = passengers?.results
    ? passengers.results.map((el) => ({
        value: el.id,
        label: el.name,
        phones: el.phones,
      }))
    : [];

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const passengersErr = formState.errors?.locationFrom?.passenger?.additionalPassengers;
    if (passengersErr?.type === 'too_small' && !isTooSmallErr && passengersErr.message) {
      setTooSmallErr(passengersErr.message);
    }

    if (passengersErr?.type !== 'too_small' && isTooSmallErr) {
      setTooSmallErr('');
    }

    if (passengersErr?.type === 'custom' && passengersErr.message) {
      setError(`${name}.${0}.phone`, {
        type: passengersErr.type,
        message: passengersErr.message,
      });
    }
  }, [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    formState.errors?.locationFrom?.passenger?.additionalPassengers,
    isTooSmallErr,
    name,
    setError,
  ]);

  return (
    <div className='flex flex-col gap-y-2'>
      <FormLabel>Pasażerowie</FormLabel>
      <FormDescription>
        Dodaj pasażerów (nie więcej niż troje). Wybierz z listy lub wprowadź dane pasażera ręcznie.
      </FormDescription>
      {fields.map((field, i) => (
        <div key={field.id}>
          <PassengerBlock i={i} name={name} remove={remove} passengers={passengersData} />
          {fields.length > 1 && i + 1 != fields.length && (
            <div className='mt-4 w-full border-2 border-gray-200' />
          )}
        </div>
      ))}
      {fields.length <= 2 && (
        <div>
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
                  Dodaj pasażera poprzez listę wyboru, która zawiera zapisanych w systemie
                  pasażerów.
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
          <p className='mt-2 text-sm font-medium text-destructive'>{isTooSmallErr}</p>
        </div>
      )}
    </div>
  );
};
