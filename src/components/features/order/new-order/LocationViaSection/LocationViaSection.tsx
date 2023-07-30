import { PlusCircle } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { LocationViaSectionItem } from '@/components/features/order/new-order/LocationViaSection/LocationViaSectionItem';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FormDescription } from '@/components/ui/form';

export const LocationViaSection = () => {
  const { control } = useFormContext();

  const { fields, append } = useFieldArray({
    name: 'locationVia',
    control: control,
  });

  return (
    <div className='flex flex-col gap-y-4 py-4'>
      <div className='flex w-full items-center justify-between'>
        <div className='text-lg font-medium'>Adres pośredni</div>
        <Button className='w-full md:w-auto' type='button' variant='outline' onClick={append}>
          Dodaj adres pośredni
          <PlusCircle className='ml-2 h-6 w-6 text-accent-foreground' />
        </Button>
      </div>
      <FormDescription>
        Możesz dodać adresy pośrednie pomiędzy lokalizacją Z oraz lokalizacją Do. Aby to zrobić
        naciśnij przycisk &quot;Dodaj adres pośredni&quot; umiejscowiony po prawej z prawej strony.
      </FormDescription>
      <Accordion type='multiple'>
        {fields.map((field, i) => {
          return <LocationViaSectionItem key={field.id} index={i} />;
        })}
      </Accordion>
    </div>
  );
};
