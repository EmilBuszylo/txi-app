'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import z from '@/lib/helpers/zod/zod';
import { logger } from '@/lib/logger';

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

const formSchema = z.object({
  login: z.string().nonempty(),
  password: z.string().nonempty(),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === 'authenticated') {
    router.push('/dashboard/orders');
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const res = await signIn('credentials', {
        ...values,
        callbackUrl: '/dashboard/orders',
        redirect: false,
      });

      if (res?.error) {
        setIsSubmitting(false);
        if (res.error === 'CredentialsSignin') {
          return form.setError('password', {
            type: 'custom',
            message: 'Login, lub hasło są nieprawidłowe',
          });
        } else {
          return form.setError('password', {
            type: 'custom',
            message: 'Błąd serwera, prosimy spróbować ponownie później',
          });
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      logger.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='login'
          render={({ field }) => (
            <FormItem className='h-[100px]'>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input placeholder='Your Login' {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='Your Password' {...field} type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex w-full items-center justify-end'>
          <Button
            className='w-full md:w-auto'
            type='submit'
            isLoading={status === 'loading' || isSubmitting}
          >
            Zaloguj
          </Button>
        </div>
      </form>
    </Form>
  );
}
