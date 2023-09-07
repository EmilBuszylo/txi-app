import { HTMLAttributes, PropsWithChildren } from 'react';
import * as React from 'react';

export const MobileItem = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className='rounded bg-gray-100 p-4 shadow-lg'>
      <div className='flex h-full w-full flex-col gap-y-4' {...props} />
    </div>
  );
};

export const MobileItemHeader = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div className='flex items-center justify-between' {...props} />;
};

interface MobileItemBodyProps {
  items: { value: string; label: string }[];
}

export const MobileItemBody = ({ items, children }: PropsWithChildren<MobileItemBodyProps>) => {
  return (
    <div className='flex flex-col gap-y-2 divide-y divide-gray-200'>
      {items.map((item) => (
        <div className='flex items-center justify-between gap-x-4 pt-2' key={item.label}>
          <span className='text-sm text-muted-foreground'>{item.label}</span>
          <span className='text-sm'>{item.value}</span>
        </div>
      ))}
      {children}
    </div>
  );
};
