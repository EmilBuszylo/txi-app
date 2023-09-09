import { Row } from '@tanstack/table-core';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { StyledLink } from '@/components/ui/link/StyledLink';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Routes } from '@/constant/routes';
import { Order } from '@/server/orders/order';

export const InternalIdCell = ({ row }: { row: Row<Order> }) => {
  const estimatedKm = (row.original.estimatedDistance || 0) + (row.original.wayBackDistance || 0);
  const diffBetweenDriverKmAndEstimated =
    (row.original.kmForDriver || 0) - estimatedKm > 20 ||
    estimatedKm - (row.original.kmForDriver || 0) > 20;
  //  At this moment is unnecessary, but it is possible that we will return this functionality
  //   TODO Ask client about future of this feature
  // const diffBetweenActualKmAndEstimated =
  //   (row.original.actualKm || 0) - estimatedKm > 20 ||
  //   estimatedKm - (row.original.actualKm || 0) > 20;
  const isAlerted = diffBetweenDriverKmAndEstimated && !row.original.isKmDifferenceAccepted;

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
              <div className='flex flex-col gap-y-1'>
                {diffBetweenDriverKmAndEstimated && (
                  <Badge variant='destructive'>Różnica w KM</Badge>
                )}
                {/*{diffBetweenActualKmAndEstimated && (*/}
                {/*  <Badge className='border-transparent bg-orange-600 text-white hover:bg-orange-600/80'>*/}
                {/*    Różnica w KM*/}
                {/*  </Badge>*/}
                {/*)}*/}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <ul className='flex flex-col gap-y-2'>
                {diffBetweenDriverKmAndEstimated && (
                  <li>
                    Różnica pomiędzy <span className='font-semibold'>szacowanymi km</span> a{' '}
                    <span className='font-semibold'>km dla kierowcy</span> wynosi ponad 20km.
                  </li>
                )}
                {/*{diffBetweenActualKmAndEstimated && (*/}
                {/*  <li>*/}
                {/*    Różnica pomiędzy <span className='font-semibold'>szacowanymi km</span> a{' '}*/}
                {/*    <span className='font-semibold'>rzeczywistymi km</span> wynosi ponad 20km.*/}
                {/*  </li>*/}
                {/*)}*/}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
