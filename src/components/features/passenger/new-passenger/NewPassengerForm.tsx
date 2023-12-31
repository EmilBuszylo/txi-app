'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { FetchError } from '@/lib/helpers/fetch-json';
import z from '@/lib/helpers/zod/zod';
import { useClients } from '@/lib/hooks/data/useClients';
import { useCreatePassenger } from '@/lib/hooks/data/useCreatePassenger';
import { CreatePassengerParams } from '@/lib/server/api/endpoints';
import { databaseErrorHandler } from '@/lib/server/utils/error';

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

const initialFormData = {
  name: '',
  clients: [],
  phones: [],
};

interface CreateNewPassengerFormParams extends Pick<CreatePassengerParams, 'name' | 'clients'> {
  phones: {
    value: string;
  }[];
}

export const createPassengerSchema = z.object({
  name: z.string(),
  phones: z.array(
    z.object({
      value: z.string(),
    })
  ),
  clients: z.array(z.string()),
});

export function NewPassengerForm() {
  const form = useForm<CreateNewPassengerFormParams>({
    resolver: zodResolver(createPassengerSchema),
    defaultValues: initialFormData,
  });
  const router = useRouter();
  const { data: clients } = useClients({ page: 1, limit: 1000 });

  const { mutateAsync: createPassenger, isLoading } = useCreatePassenger();

  const onSubmit = async (values: CreateNewPassengerFormParams) => {
    try {
      const phones = values.phones.map((phone) => phone.value);

      await createPassenger({
        name: values.name,
        clients: values.clients,
        phones,
      });

      router.push(Routes.PASSENGERS);
    } catch (error) {
      const { isDbError, targets, message } = databaseErrorHandler(error as FetchError);

      if (isDbError) {
        for (const target of targets) {
          form.setError(target as FieldPath<CreatePassengerParams>, {
            type: 'custom',
            message: message,
          });
        }
      }
    }
  };

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
