'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as React from 'react';

import { LogoutButton } from '@/components/features/auth/LogoutButton';
import SidebarIconLink from '@/components/layout/DashboardLayout/SidebarIconLink';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UnstyledLink from '@/components/ui/link/UstyledLink';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const { data } = useSession();

  const login = data?.user?.login;

  const avatarName = data?.user
    ? `${data.user?.firstName ? data.user?.firstName[0].toUpperCase() : ''}${
        data.user?.lastName ? data.user?.lastName[0].toUpperCase() : ''
      }`
    : '';

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
      <div className='flex flex-col items-center space-y-3'>
        <div className='flex items-center'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar>
                  <AvatarFallback>{avatarName}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{login}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
