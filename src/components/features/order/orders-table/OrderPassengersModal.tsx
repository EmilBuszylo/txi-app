import { getFromAdditionalPassengers } from '@/components/features/order/table/cells/PassengersListCell';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { Order } from '@/server/orders/order';

export const OrderPassengersModal = ({ item }: { item: Order }) => {
  const locationFromPassengers = [
    item.locationFrom.passenger.name,
    ...getFromAdditionalPassengers(item.locationFrom.passenger.additionalPassengers),
  ];

  const locationViaPassengers = item.locationVia?.length
    ? item.locationVia?.map((l) => [
        l.passenger?.name,
        ...getFromAdditionalPassengers(l.passenger?.additionalPassengers),
      ])
    : [];

  const allPassengers = [...locationFromPassengers, ...locationViaPassengers];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='w-fit'>
          Podgląd
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className='flex flex-col gap-y-2'>
          {allPassengers.map((p, i) => (
            <span key={`${p}${i}`}>{p}</span>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
