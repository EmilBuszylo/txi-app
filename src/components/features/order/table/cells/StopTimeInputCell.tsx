import { ChangeEvent, useState } from 'react';

import { useUpdateManyOrdersWithoutCache } from '@/lib/hooks/data/useUpdateManyOrdersWithoutCache';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Order } from '@/server/orders/order';

export const StopTimeInputCell = ({
  id,
  stopTime,
  disableValidation,
}: {
  id: Order['id'];
  stopTime: Order['stopTime'];
  disableValidation?: boolean;
}) => {
  const [value, setValue] = useState(stopTime || undefined);

  const { mutateAsync: updateOrders, isLoading } = useUpdateManyOrdersWithoutCache([id]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      return setValue(undefined);
    }

    return setValue(Number(val));
  };

  const onClickHandler = async () => {
    await updateOrders({ stopTime: value });
  };

  return (
    <div className='flex min-w-[215px] items-center justify-center gap-x-1'>
      <Input
        id='stopTime'
        name='stopTime'
        type='number'
        placeholder='Podaj łączny czas oczekiwania'
        value={value}
        onChange={onChange}
        className={cn({
          'border-destructive bg-destructive/10': !value && !disableValidation,
        })}
      />
      <Button type='button' onClick={onClickHandler} size='sm' isLoading={isLoading}>
        Zapisz
      </Button>
    </div>
  );
};
