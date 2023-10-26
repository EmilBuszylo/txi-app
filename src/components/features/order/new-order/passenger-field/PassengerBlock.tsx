import { Trash2 } from 'lucide-react';
import { UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { PassengerCombobox } from '@/components/features/order/new-order/passenger-field/PassengerCombobox';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface AutoPassengerBlockProps {
  i: number;
  name: string;
  remove: UseFieldArrayRemove;
  passengers: { value: string; label: string; phones: string[] }[];
}

export const PassengerBlock = ({ i, name, remove, passengers }: AutoPassengerBlockProps) => {
  const { control, setValue, getValues } = useFormContext();

  const passengerType = getValues(`${name}.${i}.type`) || 'custom';

  if (passengerType === 'list') {
    return (
      <div className='flex flex-col gap-y-2'>
        <FormField
          control={control}
          name={`${name}.${i}.name`}
          render={({ field }) => {
            const setPhones = (phones: string[]) => {
              return setValue(`${name}.${i}.phone`, phones[0]);
            };
            return (
              <FormItem>
                <FormControl>
                  <div className='flex items-end justify-between gap-x-2'>
                    <PassengerCombobox
                      placeholder='Wprowadź nazwę pasażera'
                      {...field}
                      label={`Pasażer ${i + 1}`}
                      items={passengers}
                      setPhones={setPhones}
                    />
                    <Button variant='ghost' onClick={() => remove(i)}>
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name={`${name}.${i}.phone`}
          render={({ field }) => {
            // eslint-disable-next-line unused-imports/no-unused-vars
            const { ref, ...rest } = field;
            return (
              <FormItem>
                <FormLabel>Numer kontaktowy 1</FormLabel>
                <FormControl>
                  <div>
                    <PatternFormat
                      format='+48 ### ### ###'
                      customInput={Input}
                      {...rest}
                      placeholder='Numer kontaktowy pasażera'
                      disabled={true}
                      readOnly={true}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name={`${name}.${i}.type`}
          render={({ field }) => {
            return (
              <FormItem hidden>
                <FormControl>
                  <input {...field} hidden />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-y-2'>
      <FormField
        control={control}
        name={`${name}.${i}.name`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className='flex items-end justify-between gap-x-2'>
                <FormItem className='w-full'>
                  <FormLabel>{`Pasażer ${i + 1}`}</FormLabel>
                  <Input {...field} className='flex-1' />
                </FormItem>
                <Button variant='ghost' onClick={() => remove(i)}>
                  <Trash2 className='h-4 w-4 text-destructive' />
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.${i}.phone`}
        render={({ field }) => {
          // eslint-disable-next-line unused-imports/no-unused-vars
          const { ref, ...rest } = field;
          return (
            <FormItem>
              <FormLabel>Numer kontaktowy</FormLabel>
              <FormControl>
                <div>
                  <PatternFormat
                    format='+48 ### ### ###'
                    customInput={Input}
                    {...rest}
                    placeholder='Numer kontaktowy pasażera'
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name={`${name}.${i}.type`}
        render={({ field }) => {
          return (
            <FormItem hidden>
              <FormControl>
                <input {...field} hidden />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
