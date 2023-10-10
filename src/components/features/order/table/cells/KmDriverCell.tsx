import { ChangeEvent, useState } from 'react';

import { useUpdateManyOrders } from '@/lib/hooks/data/useUpdateManyOrders';
import { GetOrdersParams } from '@/lib/server/api/endpoints';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Order } from '@/server/orders/order';

export const KmDriverCell = ({
  id,
  kmForDriver,
  params,
}: {
  id: Order['id'];
  kmForDriver: Order['kmForDriver'];
  params: GetOrdersParams;
}) => {
  const [value, setValue] = useState(kmForDriver || undefined);

  const { mutateAsync: updateOrders } = useUpdateManyOrders([id], params);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      return setValue(undefined);
    }

    return setValue(Number(val));
  };

  const onClickHandler = async () => {
    await updateOrders({ kmForDriver: value });
  };

  return (
    <div className='flex min-w-[215px] items-center justify-center gap-x-1'>
      <Input
        id='kmForDriver'
        name='kmForDriver'
        type='number'
        placeholder='Uzupełnij przejechane km'
        value={value}
        onChange={onChange}
        className={cn({
          'border-destructive bg-destructive/10': !value,
        })}
      />
      <Button type='button' onClick={onClickHandler}>
        Zapisz
      </Button>
    </div>
  );
};
