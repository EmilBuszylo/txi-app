import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateManyOrders } from '@/lib/hooks/data/useUpdateManyOrders';
import { logger } from '@/lib/logger';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

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

const addDriverInvoiceFormSchema = z.object({
  driverInvoice: z.string(),
});

type AddDriverInvoiceFormSchemaProps = z.infer<typeof addDriverInvoiceFormSchema>;

interface AddDriverInvoiceFromProps {
  ids: string[];
  params: GetOrdersParams;
  onSuccess: () => void;
}
export const AddDriverInvoiceFrom = ({ ids, params, onSuccess }: AddDriverInvoiceFromProps) => {
  const form = useForm<AddDriverInvoiceFormSchemaProps>({
    resolver: zodResolver(addDriverInvoiceFormSchema),
  });

  const { mutateAsync: updateOrders } = useUpdateManyOrders(ids, params);

  const onSubmit = async (values: AddDriverInvoiceFormSchemaProps) => {
    try {
      await updateOrders(values);
      onSuccess();
    } catch (error) {
      logger.error(error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='driverInvoice'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nr faktury</FormLabel>
              <FormControl>
                <Input placeholder='Wprowadź numer faktury kierowcy' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Zapisz</Button>
      </form>
    </Form>
  );
};
