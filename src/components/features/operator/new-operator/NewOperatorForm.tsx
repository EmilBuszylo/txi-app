'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FieldPath, useForm } from 'react-hook-form';

import { FetchError } from '@/lib/helpers/fetch-json';
import { useCreateOperator } from '@/lib/hooks/data/useCreateOperator';
import { CreateOperatorParams, createOperatorSchema } from '@/lib/server/api/endpoints';
import { databaseErrorHandler } from '@/lib/server/utils/error';

import { Button } from '@/components/ui/button';
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

const initialFormData = {
  name: '',
  login: '',
  password: '',
};

export function NewOperatorForm() {
  const form = useForm<CreateOperatorParams>({
    resolver: zodResolver(createOperatorSchema),
    defaultValues: initialFormData,
  });
  const router = useRouter();

  const { mutateAsync: createDriver, isLoading } = useCreateOperator();

  const onSubmit = async (values: CreateOperatorParams) => {
    try {
      await createDriver(values);

      router.push(Routes.OPERATORS);
    } catch (error) {
      const { isDbError, targets, message } = databaseErrorHandler(error as FetchError);

      if (isDbError) {
        for (const target of targets) {
          form.setError(target as FieldPath<CreateOperatorParams>, {
            type: 'custom',
            message: message,
          });
        }
      }
    }
  };

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
          <FormField
            control={form.control}
            name='login'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login</FormLabel>
                <FormControl>
                  <Input placeholder='Login opertora' {...field} />
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
                  <Input placeholder='Hasło operatora' {...field} type='password' />
                </FormControl>
                <FormDescription>
                  Hasło umożliwi bezpieczne zalogowanie się kierowcy do systemu.
                </FormDescription>
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
