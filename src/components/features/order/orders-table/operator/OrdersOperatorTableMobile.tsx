import { formatDate } from '@/lib/helpers/date';
import { GetOrdersParams } from '@/lib/server/api/endpoints';

import { ActionCellOptions } from '@/components/features/order/table/cells/ActionCell';
import { KmDriverCell } from '@/components/features/order/table/cells/KmDriverCell';
import { Button } from '@/components/ui/button';
import {
  MobileItem,
  MobileItemBody,
  MobileItemHeader,
} from '@/components/ui/data-table/mobile-item/MobileItem';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  const locationsVia = item.locationVia?.map((loc) => loc.address.fullAddress).join(',');

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
            element: <OrderWayModal item={item} />,
            value:
              item.locationFrom?.address.fullAddress &&
              `${item?.locationFrom?.address.fullAddress} -> ` + locationsVia &&
              `${locationsVia} -> ` + item?.locationTo?.address.fullAddress,
          },
          {
            label: 'Km dla kierowcy',
            element: <KmDriverCell id={item.id} kmForDriver={item.kmForDriver} params={params} />,
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

const OrderWayModal = ({ item }: { item: Order }) => {
  const locationsVia = item.locationVia?.map((loc) => loc.address.fullAddress).join(',');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='w-fit'>
          Podgląd
        </Button>
      </DialogTrigger>
      <DialogContent>
        {item.locationFrom?.address.fullAddress && `${item.locationFrom?.address.fullAddress} -> `}
        {locationsVia && `${locationsVia} -> `}
        {item.locationTo?.address.fullAddress}
      </DialogContent>
    </Dialog>
  );
};
