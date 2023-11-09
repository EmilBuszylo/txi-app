import React, { ChangeEvent, useState } from 'react';

import { useUpdateManyOrdersWithoutCache } from '@/lib/hooks/data/useUpdateManyOrdersWithoutCache';
import { UseUser } from '@/lib/hooks/useUser';
import { cn } from '@/lib/utils';

import { DisableCellEditionTooltip } from '@/components/features/order/table/cells/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Order, OrderStatus } from '@/server/orders/order';

export const StopTimeInputCell = ({
  id,
  stopTime,
  disableValidation,
  status,
}: {
  id: Order['id'];
  stopTime: Order['stopTime'];
  disableValidation?: boolean;
  status: Order['status'];
}) => {
  const [value, setValue] = useState(stopTime || undefined);
  const { user } = UseUser();

  const { mutateAsync: updateOrders, isLoading } = useUpdateManyOrdersWithoutCache([id]);

  const updateNotAllowed =
    user?.role === 'OPERATOR' && [OrderStatus.VERIFIED, OrderStatus.SETTLED].includes(status);

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
      {updateNotAllowed ? (
        <DisableCellEditionTooltip value={value} />
      ) : (
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
      )}

      {!updateNotAllowed && (
        <Button type='button' onClick={onClickHandler} size='sm' isLoading={isLoading}>
          Zapisz
        </Button>
      )}
    </div>
  );
};
