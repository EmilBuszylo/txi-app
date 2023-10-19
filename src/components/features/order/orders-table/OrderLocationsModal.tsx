import { createLocationsString } from '@/components/features/order/table/cells/LocationsCell';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { Order } from '@/server/orders/order';

export const OrderLocationsModal = ({ item }: { item: Order }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='w-fit'>
          Podgląd
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div dangerouslySetInnerHTML={{ __html: createLocationsString(item) }} />
      </DialogContent>
    </Dialog>
  );
};
