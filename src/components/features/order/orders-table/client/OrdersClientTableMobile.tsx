import { formatDate } from '@/lib/helpers/date';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { OrderLocationsModal } from '@/components/features/order/orders-table/OrderLocationsModal';
import { OrderPassengersModal } from '@/components/features/order/orders-table/OrderPassengersModal';
import { getRealizationDate } from '@/components/features/order/orders-table/utils/getRealizationDate';
import { ActionCellOptions } from '@/components/features/order/table/cells/ActionCell';
import { statusOnBadgeStyle } from '@/components/features/order/table/cells/StatusCell';
import { clientStatusLabelPerStatus } from '@/components/features/order/utils';
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

import { dateFormats } from '@/constant/date-formats';
import { Order } from '@/server/orders/order';
import { GetOrdersResponse } from '@/server/orders/orders.service';

interface OrdersTableMobileProps {
  items: GetOrdersResponse['results'];
  params: GetOrdersParams;
}

export const OrdersClientTableMobile = ({ items, params }: OrdersTableMobileProps) => {
  return (
    <div className='flex flex-col gap-y-8 md:hidden'>
      {items.map((item) => (
        <OrderClientMobileItem item={item} key={item.id} params={params} />
      ))}
    </div>
  );
};

const OrderClientMobileItem = ({ item, params }: { item: Order; params: GetOrdersParams }) => {
  return (
    <MobileItem>
      <MobileItemHeader>
        <div className='flex flex-col gap-y-2'>
          <span className='text-sm text-muted-foreground'>Nr zlecenia</span>
          {item.externalId}
        </div>
        <Badge className={statusOnBadgeStyle[item.status]}>
          {clientStatusLabelPerStatus[item.status]}
        </Badge>
      </MobileItemHeader>
      <MobileItemBody
        items={[
          {
            label: 'Nr faktury',
            value: item.clientInvoice || 'Niewystawiona',
          },
          {
            label: 'Data realizacji',
            value: getRealizationDate(item),
          },
          {
            label: 'Dodano',
            value: formatDate(item.createdAt, dateFormats.dateWithTimeShort) || '',
          },
          {
            label: 'Przebieg trasy',
            element: <OrderLocationsModal item={item} />,
            value: '',
          },
          {
            label: 'Pasażerowie',
            element: <OrderPassengersModal item={item} />,
            value: '',
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
            <ActionCellOptions params={params} id={item.id} order={item} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </MobileItem>
  );
};
