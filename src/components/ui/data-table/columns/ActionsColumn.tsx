import { MoreHorizontal } from 'lucide-react';
import { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsColumnProps {
  contentClassName?: string;
}

export const ActionsColumn = ({
  contentClassName,
  children,
}: PropsWithChildren<ActionsColumnProps>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className={contentClassName}>
        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
