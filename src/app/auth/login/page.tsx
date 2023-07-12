import { LoginForm } from '@/components/features/auth/LoginForm';

export default function Page() {
  return (
    <>
      <section className='flex min-h-screen flex-col justify-center bg-gray-100 sm:py-12'>
        <div className='xs:p-0 mx-auto p-10 md:w-full md:max-w-md'>
          <h1 className='mb-5 mt-6 text-3xl font-extrabold text-neutral-600'>Your Logo</h1>
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
