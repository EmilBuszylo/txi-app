'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import { useCreateDriver } from '@/lib/hooks/data/useCreateDriver';
import { CreateDriverParams, createDriverSchema } from '@/lib/server/api/endpoints';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Routes } from '@/constant/routes';

const initialFormData = {
  login: '',
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
  car: {
    carBrand: '',
    carModel: '',
    carColor: '',
    carRegistrationNumber: '',
  },
};

export function NewDriverForm() {
  const form = useForm<CreateDriverParams>({
    resolver: zodResolver(createDriverSchema),
    defaultValues: initialFormData,
  });
  const router = useRouter();

  const { mutateAsync: createDriver } = useCreateDriver();

  const onSubmit = async (values: CreateDriverParams) => {
    await createDriver(values);

    router.push(Routes.DRIVERS);
  };

  return (
    <div className='lg:max-w-2xl'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormItem>
            <FormLabel>Login</FormLabel>
            <FormControl>
              <Input placeholder='Login kierowcy' readOnly disabled />
            </FormControl>
            <FormDescription>
              Login zostanie wygenerowany automatycznie po dodaniu kierowcy. Pola nie można
              edytować.
            </FormDescription>
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imię</FormLabel>
                <FormControl>
                  <Input placeholder='Imię kierowcy' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nazwisko</FormLabel>
                <FormControl>
                  <Input placeholder='Nazwisko kierowcy' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input placeholder='Hasło kierwocy' {...field} type='password' />
                </FormControl>
                <FormDescription>
                  Hasło umożliwi bezpieczne zalogowanie się kierowcy do systemu.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => {
              // eslint-disable-next-line unused-imports/no-unused-vars
              const { ref, ...rest } = field;
              return (
                <FormItem>
                  <FormLabel>Numer kontaktowy</FormLabel>
                  <FormControl>
                    <div>
                      <PatternFormat
                        format='+48 ### ### ###'
                        customInput={Input}
                        {...rest}
                        placeholder='Numer kontaktowy do kierowcy'
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Podczas wprowadzania nr kontaktowego, numer zostanie sformatowany automatycznie.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name='car.carBrand'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marka</FormLabel>
                <FormControl>
                  <Input placeholder='Marka samochodu' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='car.carModel'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder='Model samochodu' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='car.carColor'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kolor</FormLabel>
                <FormControl>
                  <Input placeholder='Kolor samochodu' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='car.carRegistrationNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numer rejestracyjny</FormLabel>
                <FormControl>
                  <Input placeholder='Nr rejestracyjny samochodu' {...field} />
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
    </div>
  );
}
