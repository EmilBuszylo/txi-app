import { ChangeEvent, useState } from 'react';

import { useUpdateManyOrdersWithoutCache } from '@/lib/hooks/data/useUpdateManyOrdersWithoutCache';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Order } from '@/server/orders/order';

export const HighwayCostInputCell = ({
  id,
  highwaysCost,
}: {
  id: Order['id'];
  highwaysCost: Order['highwaysCost'];
}) => {
  const [value, setValue] = useState(highwaysCost || undefined);

  const { mutateAsync: updateOrders, isLoading } = useUpdateManyOrdersWithoutCache([id]);

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
      <Input
        id='highwaysCost'
        name='highwaysCost'
        type='text'
        onKeyDown={(event) => {
          if (
            !/[0-9]/.test(event.key) &&
            !['ArrowLeft', 'ArrowRight', 'Backspace'].includes(event.key)
          ) {
            event.preventDefault();
          }
        }}
        placeholder='Podaj koszt płatnych odcinków'
        value={value}
        onChange={onChange}
        className={cn({
          'border-destructive bg-destructive/10': !value,
        })}
      />
      <Button type='button' onClick={onClickHandler} size='sm' isLoading={isLoading}>
        Zapisz
      </Button>
    </div>
  );
};
