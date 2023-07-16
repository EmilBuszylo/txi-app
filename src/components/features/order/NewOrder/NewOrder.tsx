'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { CreateOrder, createOrderSchema } from '@/server/orders/orders.service';

export function NewOrder() {
  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
  });

  const onSubmit = async (values: CreateOrder) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='externalId'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Your Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
