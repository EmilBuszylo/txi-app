import * as React from 'react';

import { useOperator } from '@/lib/hooks/data/useOperator';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const OperatorAvatar = ({ operatorId }: { operatorId: string }) => {
  const { data } = useOperator(operatorId);

  const name = data?.name || '';

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
