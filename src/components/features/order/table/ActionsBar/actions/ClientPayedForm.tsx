import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateManyOrders } from '@/lib/hooks/data/useUpdateManyOrders';
import { logger } from '@/lib/logger';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

const clientPayedFormSchema = z.object({
  isPayed: z.boolean(),
});

type ClientPayedFormSchemaProps = z.infer<typeof clientPayedFormSchema>;

interface ClientPayedFormProps {
  ids: string[];
  params: GetOrdersParams;
  onSuccess: () => void;
}
export const ClientPayedForm = ({ ids, params, onSuccess }: ClientPayedFormProps) => {
  const form = useForm<ClientPayedFormSchemaProps>({
    resolver: zodResolver(clientPayedFormSchema),
  });

  const { mutateAsync: updateOrders } = useUpdateManyOrders(ids, params);

  const onSubmit = async (values: ClientPayedFormSchemaProps) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='isPayed'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-ignore*/}
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Czy klient opłacił fakturę?</FormLabel>
                <FormDescription>
                  Zaznacz powyższe pole w przypadku gdy klient uregulował fakturę za zlecony kurs.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
};
