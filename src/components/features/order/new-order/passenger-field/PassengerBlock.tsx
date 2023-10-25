import { Trash2 } from 'lucide-react';
import { UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { usePassangers } from '@/lib/hooks/data/usePassangers';
import { cn } from '@/lib/utils';

import { PassengerCombobox } from '@/components/features/order/new-order/passenger-field/PassengerCombobox';
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

interface AutoPassengerBlockProps {
  i: number;
  name: string;
  remove: UseFieldArrayRemove;
}

export const PassengerBlock = ({ i, name, remove }: AutoPassengerBlockProps) => {
  const { control, setValue, getValues } = useFormContext();

  const { data: passengers } = usePassangers({ page: 1, limit: 1000 });

  const passengersData = passengers?.results
    ? passengers.results.map((el) => ({
        value: el.id,
        label: el.name,
        phones: el.phones,
      }))
    : [];

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
                <FormLabel className={cn(i !== 0 && 'sr-only')}>Pasażerowie</FormLabel>
                <FormDescription className={cn(i !== 0 && 'sr-only')}>
                  Dodaj dodatkowych pasażerów (nie więcej niż troje). Wybierz z listy lub wprowadź
                  dane pasażera ręcznie.
                </FormDescription>
                <FormControl>
                  <div className='flex items-end justify-between gap-x-2'>
                    <PassengerCombobox
                      placeholder='Wprowadź nazwę pasażera'
                      {...field}
                      label={`Pasażer ${i + 1}`}
                      items={passengersData}
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
            <FormLabel className={cn(i !== 0 && 'sr-only')}>Pasażerowie</FormLabel>
            <FormDescription className={cn(i !== 0 && 'sr-only')}>
              Dodaj dodatkowych pasażerów (nie więcej niż troje). Wybierz z listy lub wprowadź dane
              pasażera ręcznie.
            </FormDescription>
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
