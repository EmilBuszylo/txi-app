import { Row } from '@tanstack/table-core';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { StyledLink } from '@/components/ui/link/StyledLink';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Routes } from '@/constant/routes';
import { Order } from '@/server/orders/order';

export const InternalIdCell = ({ row }: { row: Row<Order> }) => {
  const estimatedKm = (row.original.estimatedDistance || 0) + (row.original.wayBackDistance || 0);
  const isAlerted =
    (row.original.kmForDriver || 0) - estimatedKm > 20 ||
    estimatedKm - (row.original.kmForDriver || 0) > 20;

  return (
    <div>
      <StyledLink
        href={`${Routes.ORDERS}/${row.original.id}`}
        className={cn({
          'text-destructive': isAlerted,
        })}
      >
        {row.original.internalId}
      </StyledLink>
      {isAlerted && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant='destructive'>Różnica w KM</Badge>
            </TooltipTrigger>
            <TooltipContent>
              Różnica pomiędzy szacowanymi km a km dla kierowcy wynosi ponad 20km.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
