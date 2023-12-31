import { PlusCircle } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { LocationViaSectionItem } from '@/components/features/order/new-order/LocationViaSection/LocationViaSectionItem';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FormDescription } from '@/components/ui/form';

export const LocationViaSection = ({
  defaultMapUrls,
  isClient,
}: {
  defaultMapUrls?: string[];
  isClient?: boolean;
}) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: 'locationVia',
    control: control,
  });

  return (
    <div className='flex flex-col bg-gray-50 py-4'>
      <div className='mb-4 flex w-full items-center justify-between px-4 '>
        <div className='text-lg font-medium '>Adres pośredni</div>
        <Button className='w-full md:w-auto' type='button' variant='outline' onClick={append}>
          Dodaj adres pośredni
          <PlusCircle className='ml-2 h-6 w-6 text-accent-foreground' />
        </Button>
      </div>

      <Accordion type='multiple'>
        {fields.map((field, i) => {
          return (
            <LocationViaSectionItem
              key={field.id}
              index={i}
              defaultMapUrl={defaultMapUrls ? defaultMapUrls[i] : undefined}
              removeItem={() => remove(i)}
              isClient={isClient}
            />
          );
        })}
      </Accordion>
      <FormDescription className='px-4'>
        Możesz dodać adresy pośrednie pomiędzy miejscem odbioru oraz miejscem docelowym. Aby to
        zrobić naciśnij przycisk &quot;Dodaj adres pośredni&quot; umiejscowiony z prawej strony.
      </FormDescription>
    </div>
  );
};
