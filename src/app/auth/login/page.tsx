import * as React from 'react';

import { LoginForm } from '@/components/features/auth/LoginForm';
import { Logo } from '@/components/ui/logo';

export default function Page() {
  return (
    <>
      <section className='flex min-h-screen flex-col justify-center bg-gray-100 sm:py-12'>
        <div className='xs:p-0 mx-auto p-10 md:w-full md:max-w-md'>
          <div className='mb-5 mt-6 flex w-full items-center justify-center'>
            <span className='sr-only'>TXI logo</span>
            <Logo size='lg' />
          </div>
          <div className='w-full divide-y divide-gray-200 rounded-lg bg-white shadow-lg'>
            <div className='px-5 py-7'>
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
