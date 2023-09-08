import { Inter } from 'next/font/google';

import './globals.css';

import { Toaster } from '@/components/ui/toaster';

import Providers from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TXI Zlecenia',
  description: 'TXI Zlecenia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
