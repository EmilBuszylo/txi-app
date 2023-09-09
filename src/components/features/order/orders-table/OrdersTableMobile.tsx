import { formatDate } from '@/lib/helpers/date';
import { GetOrdersParams } from '@/lib/server/api/endpoints';
import { cn } from '@/lib/utils';

import { ActionCellOptions } from '@/components/features/order/table/cells/ActionCell';
import { statusOnBadgeStyle } from '@/components/features/order/table/cells/StatusCell';
import { statusLabelPerStatus } from '@/components/features/order/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MobileItem,
  MobileItemBody,
  MobileItemHeader,
} from '@/components/ui/data-table/mobile-item/MobileItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StyledLink } from '@/components/ui/link/StyledLink';

import { dateFormats } from '@/constant/date-formats';
import { Routes } from '@/constant/routes';
import { Order } from '@/server/orders/order';
import { GetOrdersResponse } from '@/server/orders/orders.service';

interface OrdersTableMobileProps {
  items: GetOrdersResponse['results'];
  params: GetOrdersParams;
}

export const OrdersTableMobile = ({ items, params }: OrdersTableMobileProps) => {
  return (
    <div className='flex flex-col gap-y-8 md:hidden'>
      {items.map((item) => (
        <OrderMobileItem item={item} key={item.id} params={params} />
      ))}
    </div>
  );
};

const OrderMobileItem = ({ item, params }: { item: Order; params: GetOrdersParams }) => {
  const estimatedKm = (item.estimatedDistance || 0) + (item.wayBackDistance || 0);
  const diffBetweenDriverKmAndEstimated =
    (item.kmForDriver || 0) - estimatedKm > 20 || estimatedKm - (item.kmForDriver || 0) > 20;
  const isAlerted = diffBetweenDriverKmAndEstimated && !item.isKmDifferenceAccepted;

  return (
    <MobileItem>
      <MobileItemHeader>
        <div className='flex flex-col gap-y-2'>
          <span className='text-sm text-muted-foreground'>Numer TXI</span>
          <StyledLink
            href={`${Routes.ORDERS}/${item.internalId}`}
            className={cn('font-semibold leading-none tracking-tight', {
              'text-destructive': isAlerted,
            })}
          >
            {item.internalId}
          </StyledLink>
          {diffBetweenDriverKmAndEstimated && <Badge variant='destructive'>Różnica w KM</Badge>}
        </div>
        <Badge className={statusOnBadgeStyle[item.status]}>
          {statusLabelPerStatus[item.status]}
        </Badge>
      </MobileItemHeader>
      <MobileItemBody
        items={[
          {
            label: 'Operator',
            value: item.driver?.operatorName || '',
          },
          {
            label: 'Klient',
            value: item.clientName || '',
          },
          {
            label: 'Data realizacji',
            value: formatDate(item.locationFrom?.date, dateFormats.dateWithTimeShort) || '',
          },
          {
            label: 'Dodano',
            value: formatDate(item.createdAt, dateFormats.dateWithTimeShort) || '',
          },
        ]}
      />
      <div className='mt-2 flex w-full items-center justify-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='w-full'>
              Akcje zlecenia
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center'>
            <ActionCellOptions params={params} id={item.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </MobileItem>
  );
};
