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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const acceptKmDifferenceFormSchema = z.object({
  isKmDifferenceAccepted: z.boolean(),
});

type AcceptKmDifferenceFormSchemaProps = z.infer<typeof acceptKmDifferenceFormSchema>;

interface AcceptKmDifferenceFormProps {
  ids: string[];
  params: GetOrdersParams;
  onSuccess: () => void;
}
export const AcceptKmDifferenceForm = ({ ids, params, onSuccess }: AcceptKmDifferenceFormProps) => {
  const form = useForm<AcceptKmDifferenceFormSchemaProps>({
    resolver: zodResolver(acceptKmDifferenceFormSchema),
  });

  const { mutateAsync: updateOrders } = useUpdateManyOrders(ids, params);

  const onSubmit = async (values: AcceptKmDifferenceFormSchemaProps) => {
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
          name='isKmDifferenceAccepted'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Czy zaakceptowano różnice w km</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Zapisz</Button>
      </form>
    </Form>
  );
};
