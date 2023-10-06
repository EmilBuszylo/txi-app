import * as React from 'react';

import { useClient } from '@/lib/hooks/data/useClient';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const CompanyAvatar = ({ clientId }: { clientId: string }) => {
  const { data } = useClient(clientId);

  const name = data?.fullName ? data.fullName : data?.name ? data.name : '';

  const avatarName = name.length > 2 ? name[0].toUpperCase() + name[1]?.toUpperCase() : '';

  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar>
          <AvatarFallback>{avatarName}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>{name}</TooltipContent>
    </Tooltip>
  );
};
