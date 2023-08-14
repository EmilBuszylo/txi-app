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

const addInvoiceFormSchema = z.object({
  clientInvoice: z.string(),
});

type AddInvoiceFormSchemaProps = z.infer<typeof addInvoiceFormSchema>;

interface AddClientInvoiceFormProps {
  ids: string[];
  onSuccess: () => void;
  params: GetOrdersParams;
}
export const AddClientInvoiceForm = ({ ids, onSuccess, params }: AddClientInvoiceFormProps) => {
  const form = useForm<AddInvoiceFormSchemaProps>({
    resolver: zodResolver(addInvoiceFormSchema),
  });

  const { mutateAsync: updateOrders } = useUpdateManyOrders(ids, params);

  const onSubmit = async (values: AddInvoiceFormSchemaProps) => {
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
          name='clientInvoice'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nr faktury</FormLabel>
              <FormControl>
                <Input placeholder='Wprowadź numer faktury klienta' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};
