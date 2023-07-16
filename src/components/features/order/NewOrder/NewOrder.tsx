'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateOrder } from '@/lib/hooks/data/useCreateOrder';
import { CreateOrderParams, createOrderSchema } from '@/lib/server/api/endpoints';

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

export function NewOrder() {
  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
  });
  const router = useRouter();

  const { mutateAsync: createOrder } = useCreateOrder();

  const onSubmit = async (values: CreateOrderParams) => {
    // eslint-disable-next-line no-console
    await createOrder(values);

    // TODO add error handling
    // if (!res) {
    //   console.error('error');
    // }

    router.push(Routes.ORDERS);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='externalId'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Nr zlecenia</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex w-full items-center justify-end'>
          <Button className='w-full md:w-auto' type='submit'>
            Zapisz
          </Button>
        </div>
      </form>
    </Form>
  );
}
