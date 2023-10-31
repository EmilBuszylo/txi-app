import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateManyOrders } from '@/lib/hooks/data/useUpdateManyOrders';
import { logger } from '@/lib/logger';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

import { Order } from '@/server/orders/order';

const operatorNoteSchema = z.object({
  operatorNote: z.string(),
});

type OperatorNoteSchemaProps = z.infer<typeof operatorNoteSchema>;

export const OperatorNoteCell = ({ order, params }: { order: Order; params: GetOrdersParams }) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<OperatorNoteSchemaProps>({
    resolver: zodResolver(operatorNoteSchema),
    defaultValues: {
      operatorNote: order.operatorNote || '',
    },
  });
  const { toast } = useToast();
  const { mutateAsync: updateOrder, isLoading } = useUpdateManyOrders([order.id], params, {
    disableCacheUpdate: true,
    disableCustomToast: true,
  });

  const onSubmit = async (values: OperatorNoteSchemaProps) => {
    try {
      await updateOrder({ operatorNote: values.operatorNote });
      setOpen(false);
      toast({
        description: 'Notatka została zapisana',
        variant: 'success',
      });
    } catch (error) {
      toast({
        description: 'Wystąpił nieznany błąd, proszę próbować ponownie później',
        variant: 'destructive',
      });
      logger.error(error);
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' className='w-fit'>
          {order.operatorNote ? 'Pokaż/edytuj' : 'Dodaj'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='operatorNote'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twoja notatka</FormLabel>
                  <Textarea
                    placeholder='Twoje uwagi do zlecenia'
                    className='min-h-[180px] resize-none'
                    {...field}
                  />
                </FormItem>
              )}
            />
            <Button type='submit' isLoading={isLoading}>
              Zapisz
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
