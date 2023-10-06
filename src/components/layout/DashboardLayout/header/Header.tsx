'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';

import { UseUser } from '@/lib/hooks/useUser';

import { LogoutButton } from '@/components/features/auth/LogoutButton';
import { CompanyAvatar } from '@/components/layout/DashboardLayout/header/CompanyAvatar';
import SidebarIconLink from '@/components/layout/DashboardLayout/SidebarIconLink';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import UnstyledLink from '@/components/ui/link/UstyledLink';
import { Logo } from '@/components/ui/logo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Routes } from '@/constant/routes';
import { UserRole } from '@/server/users/user';

import DriversIcons from '~/svg/icons/car.svg';
import OperatorsIcon from '~/svg/icons/glob.svg';
import CollectionPointsIcon from '~/svg/icons/map-pin.svg';
import OrdersIcon from '~/svg/icons/orders.svg';

const links = [
  {
    href: Routes.ORDERS,
    label: 'Zlecenia',
    icon: OrdersIcon,
    allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER, UserRole.CLIENT],
  },
  {
    href: Routes.DRIVERS,
    label: 'Kierowcy',
    icon: DriversIcons,
    allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER],
  },
  {
    href: Routes.COLLECTION_POINTS,
    label: 'Punkty Zborne',
    icon: CollectionPointsIcon,
    allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER],
  },
  {
    href: Routes.OPERATORS,
    label: 'Operatorzy',
    icon: OperatorsIcon,
    allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER],
  },
];

const isActiveRoute = (link: string, asPath: string) => {
  return link === asPath || (link !== '/' && asPath.startsWith(link));
};

export default function Header() {
  const { user } = UseUser();
  const pathname = usePathname();

  const login = user?.login;
  const role = user?.role;

  const avatarName =
    user?.firstName || user?.lastName
      ? `${user?.firstName ? user?.firstName[0].toUpperCase() : ''}${
          user?.lastName ? user?.lastName[0].toUpperCase() : ''
        }`
      : user?.login
      ? user.login[0].toUpperCase() + user.login[1].toUpperCase()
      : '';

  return (
    <header className='flex h-full w-20 flex-col justify-between bg-gray-900 py-3.5 lg:fixed lg:left-0 lg:top-0 lg:z-50 lg:border-r lg:border-gray-100 xl:w-40'>
      <div className='flex flex-col items-center justify-center'>
        <UnstyledLink
          className='mb-11 hidden h-11 w-11 items-center justify-center rounded lg:flex'
          href='/'
        >
          <span className='sr-only'>TXI logo</span>
          <Logo />
        </UnstyledLink>
        <nav className='w-full'>
          <ul className='flex flex-col items-center space-y-3'>
            {links
              .filter((link) => role && link.allowedRoles.includes(role))
              .map(({ href, label, icon: Icon }) => (
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
            {typeof user?.clientId === 'string' ? (
              <CompanyAvatar clientId={user.clientId} />
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarFallback>{avatarName}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{login}</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}
