'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useCreateOperator } from '@/lib/hooks/data/useCreateOperator';
import { CreateOperatorParams, createOperatorSchema } from '@/lib/server/api/endpoints';

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

import { Routes } from '@/constant/routes';

const initialFormData = {
  name: '',
};

export function NewOperatorForm() {
  const form = useForm<CreateOperatorParams>({
    resolver: zodResolver(createOperatorSchema),
    defaultValues: initialFormData,
  });
  const router = useRouter();

  const { mutateAsync: createDriver, isLoading } = useCreateOperator();

  const onSubmit = async (values: CreateOperatorParams) => {
    await createDriver(values);

    router.push(Routes.OPERATORS);
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
