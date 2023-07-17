'use client';

import { useForm } from 'react-hook-form';

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

export function NewCollectionPoint() {
  const form = useForm({});
  const onSubmit = async (values: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='namw'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input placeholder='Nazwa' {...field} />
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
