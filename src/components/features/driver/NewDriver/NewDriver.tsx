'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { useCreateDriver } from '@/lib/hooks/data/useCreateDriver';
import { CreateDriverParams, createDriverSchema } from '@/lib/server/api/endpoints';

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
import { Input } from '@/components/ui/input';

import { Routes } from '@/constant/routes';

export function NewDriver() {
  const form = useForm<CreateDriverParams>({
    resolver: zodResolver(createDriverSchema),
  });
  const router = useRouter();

  const { mutateAsync: createDriver } = useCreateDriver();

  const onSubmit = async (values: CreateDriverParams) => {
    // eslint-disable-next-line no-console
    await createDriver(values);

    // TODO add error handling
    // if (!res) {
    //   console.error('error');
    // }

    router.push(Routes.DRIVERS);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Nazwisko</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Nr kontaktowy</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/*  ADD divider*/}
        <FormField
          control={form.control}
          name='car.model'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='car.brand'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Marka</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='car.color'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Kolor</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='car.registrationNumber'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Nr rejestracyjny</FormLabel>
              <FormControl>
                <Input placeholder='Nr zlecenia' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='withOwnCar'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*  @ts-ignore */}
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Własny samochód</FormLabel>
              </div>
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
