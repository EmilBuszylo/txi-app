import { formatDate } from '@/lib/helpers/date';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { OrderLocationsModal } from '@/components/features/order/orders-table/OrderLocationsModal';
import { ActionCellOptions } from '@/components/features/order/table/cells/ActionCell';
import { KmDriverCell } from '@/components/features/order/table/cells/KmDriverCell';
import { OperatorNoteCell } from '@/components/features/order/table/cells/OperatorNoteCell';
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

export const OrdersOperatorTableMobile = ({ items, params }: OrdersTableMobileProps) => {
  return (
    <div className='flex flex-col gap-y-8 md:hidden'>
      {items.map((item) => (
        <OrderOperatorMobileItem item={item} key={item.id} params={params} />
      ))}
    </div>
  );
};

const OrderOperatorMobileItem = ({ item, params }: { item: Order; params: GetOrdersParams }) => {
  return (
    <MobileItem>
      <MobileItemHeader>
        <div className='flex flex-col gap-y-2'>
          <span className='text-sm text-muted-foreground'>Nr TXI</span>
          {item.internalId}
        </div>
      </MobileItemHeader>
      <MobileItemBody
        items={[
          {
            label: 'Przebieg trasy',
            element: <OrderLocationsModal item={item} />,
            value: '',
          },
          {
            label: 'Km dla kierowcy',
            element: (
              <KmDriverCell id={item.id} kmForDriver={item.kmForDriver} status={item.status} />
            ),
            value: item.kmForDriver || 0,
          },
          {
            label: 'Dodano',
            value: formatDate(item.createdAt, dateFormats.dateWithTimeShort) || '',
          },
          {
            label: 'Kierowca',
            value: `${item?.driver?.firstName} ${item?.driver?.lastName}`,
          },
          {
            label: 'Notatka',
            value: '',
            element: <OperatorNoteCell order={item} params={params} />,
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
