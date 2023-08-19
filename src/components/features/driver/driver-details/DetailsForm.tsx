'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { z } from 'zod';

import { useOperators } from '@/lib/hooks/data/useOperators';
import { useUpdateDriver } from '@/lib/hooks/data/useUpdateDriver';
import { UpdateDriverParams, updateDriverSchema } from '@/lib/server/api/endpoints';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Routes } from '@/constant/routes';

interface NewDriverProps {
  defaultValues: UpdateDriverParams;
  id: string;
}

const initialFormData = {
  login: '',
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
  operatorId: '',
  car: {
    carModel: '',
    carBrand: '',
    carColor: '',
    carRegistrationNumber: '',
  },
};

export function DetailForm({ defaultValues, id }: NewDriverProps) {
  const form = useForm<z.infer<typeof updateDriverSchema>>({
    resolver: zodResolver(updateDriverSchema),
    defaultValues: { ...defaultValues, password: 'passwordstring' } || initialFormData,
  });
  const router = useRouter();
  const { data: operators } = useOperators({ page: 1, limit: 1000 });

  const { mutateAsync: updateDriver, isLoading } = useUpdateDriver(id || '');

  const onSubmit = async (values: z.infer<typeof updateDriverSchema>) => {
    await updateDriver(values);

    router.push(Routes.DRIVERS);
  };

  const operatorsData = operators
    ? operators.results.map((result) => ({
        value: result.id,
        label: result.name,
      }))
    : [];

  useEffect(() => {
    if (defaultValues) {
      form.reset();
    }
  }, [defaultValues, form]);

  return (
    <div className='lg:max-w-2xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='login'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <Input placeholder='Login kierowcy' readOnly disabled={!field.value} {...field} />
                </FormControl>
                <FormDescription>
                  Login zostanie wygenerowany automatycznie po dodaniu kierowcy. Pola nie można
                  edytować.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input placeholder='Imię kierowcy' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input placeholder='Nazwisko kierowcy' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Hasło kierwocy'
                    {...field}
                    type='password'
                    disabled
                    readOnly
                  />
                </FormControl>
                <FormDescription>
                  Hasło umożliwi bezpieczne zalogowanie się kierowcy do systemu.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
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
                        placeholder='Numer kontaktowy do kierowcy'
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Podczas wprowadzania nr kontaktowego, numer zostanie sformatowany automatycznie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Combobox
            label='Operator'
            name='operatorId'
            items={operatorsData}
            inputText='Wybierz operatora'
          />
          <FormField
            control={form.control}
            name='car.carModel'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder='Model samochodu' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='car.carBrand'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marka</FormLabel>
                <FormControl>
                  <Input placeholder='Marka samochodu' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='car.carColor'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kolor</FormLabel>
                <FormControl>
                  <Input placeholder='Kolor samochodu' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='car.carRegistrationNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer rejestracyjny</FormLabel>
                <FormControl>
                  <Input placeholder='Nr rejestracyjny samochodu' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
