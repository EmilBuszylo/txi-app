'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useClients } from '@/lib/hooks/data/useClients';
import { useUpdatePassenger } from '@/lib/hooks/data/useUpdatePassenger';

import { PhoneNumbersField } from '@/components/features/passenger/new-passenger/PhoneNumbersField';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiCombobox } from '@/components/ui/multiCombobox';

import { Routes } from '@/constant/routes';

interface NewPassengerProps {
  defaultValues: z.infer<typeof updatePassengerSchema>;
  id: string;
}

const initialFormData = {
  name: '',
  clients: [],
  phones: [],
};

export const updatePassengerSchema = z.object({
  name: z.string(),
  phones: z.array(
    z.object({
      value: z.string(),
    })
  ),
  clients: z.array(z.string()),
});

export function DetailsForm({ defaultValues, id }: NewPassengerProps) {
  const [isDefaultAdded, setIsDefaultAdded] = useState(false);
  const form = useForm<z.infer<typeof updatePassengerSchema>>({
    resolver: zodResolver(updatePassengerSchema),
    defaultValues: { ...defaultValues } || initialFormData,
  });
  const router = useRouter();
  const { data: clients } = useClients({ page: 1, limit: 1000 });

  const { mutateAsync: updatePassenger, isLoading } = useUpdatePassenger(id || '');

  const onSubmit = async (values: z.infer<typeof updatePassengerSchema>) => {
    const phones = values.phones.map((phone) => phone.value);

    await updatePassenger({
      name: values.name,
      clients: values.clients,
      phones,
    });

    router.push(Routes.PASSENGERS);
  };

  useEffect(() => {
    if (defaultValues && !isDefaultAdded) {
      form.reset();
      setIsDefaultAdded(true);
    }
  }, [defaultValues, form, isDefaultAdded]);

  const clientsData = clients
    ? clients.results.map((result) => ({
        value: result.id,
        label: result.name,
      }))
    : [];

  return (
    <div className='lg:max-w-2xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwa</FormLabel>
                <FormControl>
                  <Input placeholder='Imię kierowcy' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PhoneNumbersField name='phones' />
          <MultiCombobox
            label='Firma'
            name='clients'
            items={clientsData}
            inputText='Wprowadź nazwę firmy'
          />
          <div className='flex w-full items-center justify-end'>
            <Button className='w-full md:w-auto' type='submit' isLoading={isLoading}>
              Zapisz
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
