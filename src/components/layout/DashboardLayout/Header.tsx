'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

import { LogoutButton } from '@/components/features/auth/LogoutButton';
import SidebarIconLink from '@/components/layout/DashboardLayout/SidebarIconLink';
import UnstyledLink from '@/components/ui/link/UstyledLink';

import { Routes } from '@/constant/routes';

import DriversIcons from '~/svg/icons/car.svg';
import CollectionPointsIcon from '~/svg/icons/map-pin.svg';
import OrdersIcon from '~/svg/icons/orders.svg';

const links = [
  { href: Routes.ORDERS, label: 'Zlecenia', icon: OrdersIcon },
  { href: Routes.DRIVERS, label: 'Kierowcy', icon: DriversIcons },
  { href: Routes.COLLECTION_POINTS, label: 'Punkty Zborne', icon: CollectionPointsIcon },
];

const isActiveRoute = (link: string, asPath: string) => {
  return link === asPath || (link !== '/' && asPath.startsWith(link));
};

export default function Header() {
  const pathname = usePathname();

  return (
    <header className='flex h-full w-20 flex-col justify-between bg-gray-900 py-3.5 lg:fixed lg:left-0 lg:top-0 lg:z-50 lg:border-r lg:border-gray-100 xl:w-40'>
      <div className='flex flex-col items-center justify-center'>
        <UnstyledLink
          className='mb-11 hidden h-11 w-11 items-center justify-center rounded bg-white lg:flex'
          href='/'
        >
          Logo
          {/*<Logo className='h-8 w-8' />*/}
        </UnstyledLink>
        <nav className='w-full'>
          <ul className='flex flex-col items-center space-y-3'>
            {links.map(({ href, label, icon: Icon }) => (
              <li key={`${href}${label}`} className='w-full'>
                <SidebarIconLink href={href} active={isActiveRoute(href, pathname)}>
                  <span className='sr-only'>{label}</span>
                  <Icon className='h-8 w-8' />
                  <span className='hidden xl:block'>{label}</span>
                </SidebarIconLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className='flex flex-col items-center'>
        <LogoutButton />
      </div>
    </header>
  );
}
