import React, { ChangeEvent, useState } from 'react';

import { useUpdateManyOrdersWithoutCache } from '@/lib/hooks/data/useUpdateManyOrdersWithoutCache';
import { UseUser } from '@/lib/hooks/useUser';
import { cn } from '@/lib/utils';

import { DisableCellEditionTooltip } from '@/components/features/order/table/cells/components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Order, OrderStatus } from '@/server/orders/order';

export const HighwayCostInputCell = ({
  id,
  highwaysCost,
  disableValidation,
  status,
}: {
  id: Order['id'];
  highwaysCost: Order['highwaysCost'];
  disableValidation?: boolean;
  status: Order['status'];
}) => {
  const { user } = UseUser();
  const [value, setValue] = useState(highwaysCost || undefined);

  const { mutateAsync: updateOrders, isLoading } = useUpdateManyOrdersWithoutCache([id]);

  const updateNotAllowed =
    user?.role === 'OPERATOR' && [OrderStatus.VERIFIED, OrderStatus.SETTLED].includes(status);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e?.target?.value ? e.target.value.replaceAll(',', '').replaceAll(' ', '') : 0;

    if (newVal === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-ignore
      return setValue('');
    }

    return setValue(Number(newVal).toLocaleString());
  };

  const onClickHandler = async () => {
    await updateOrders({ highwaysCost: value });
  };

  return (
    <div className='flex min-w-[215px] items-center justify-center gap-x-1'>
      {updateNotAllowed ? (
        <DisableCellEditionTooltip value={value} />
      ) : (
        <Input
          id='highwaysCost'
          name='highwaysCost'
          type='text'
          onKeyDown={(event) => {
            if (
              !/[0-9]/.test(event.key) &&
              !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Shift'].includes(event.key)
            ) {
              event.preventDefault();
            }
          }}
          placeholder='Podaj koszt płatnych odcinków'
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
