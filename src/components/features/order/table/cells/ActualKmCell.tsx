import { ChangeEvent, useState } from 'react';

import { useUpdateManyOrdersWithoutCache } from '@/lib/hooks/data/useUpdateManyOrdersWithoutCache';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Order } from '@/server/orders/order';

export const ActualKmCell = ({
  id,
  actualKm,
}: {
  id: Order['id'];
  actualKm: Order['actualKm'];
}) => {
  const [value, setValue] = useState(actualKm || undefined);

  const { mutateAsync: updateOrders, isLoading } = useUpdateManyOrdersWithoutCache([id]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      return setValue(undefined);
    }

    return setValue(Number(val));
  };

  const onClickHandler = async () => {
    await updateOrders({ actualKm: value });
  };

  return (
    <div className='flex min-w-[215px] items-center justify-center gap-x-1'>
      <Input
        id='actualKm'
        name='actualKm'
        type='text'
        onKeyDown={(event) => {
          if (
            !/[0-9]/.test(event.key) &&
            !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Shift'].includes(event.key)
          ) {
            event.preventDefault();
          }
        }}
        placeholder='Uzupełnij rzeczywiste km'
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
