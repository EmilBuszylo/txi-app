'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateOperator } from '@/lib/hooks/data/useUpdateOperator';
import { UpdateOperatorParams, updateOperatorSchema } from '@/lib/server/api/endpoints';

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

interface NewOperatorProps {
  defaultValues: UpdateOperatorParams;
  id: string;
}

const initialFormData = {
  login: '',
  password: '',
  name: '',
};

export function DetailsForm({ defaultValues, id }: NewOperatorProps) {
  const [isDefaultAdded, setIsDefaultAdded] = useState(false);
  const form = useForm<z.infer<typeof updateOperatorSchema>>({
    resolver: zodResolver(updateOperatorSchema),
    defaultValues: { ...defaultValues, password: '' } || initialFormData,
  });
  const router = useRouter();

  const { mutateAsync: updateOperator, isLoading } = useUpdateOperator(id || '');

  const onSubmit = async (values: z.infer<typeof updateOperatorSchema>) => {
    await updateOperator(values);

    router.push(Routes.OPERATORS);
  };

  useEffect(() => {
    if (defaultValues && !isDefaultAdded) {
      form.reset();
      setIsDefaultAdded(true);
    }
  }, [defaultValues, form, isDefaultAdded]);

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
