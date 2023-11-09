import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { statusLabelPerStatus } from '@/components/features/order/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { checkIfStatusChangeIsForbidden, OrderStatus } from '@/server/orders/order';

export const StatusField = ({
  isDispatcher,
  currentStatus,
}: {
  isDispatcher?: boolean;
  currentStatus?: OrderStatus;
}) => {
  const { control } = useFormContext();

  const kmForDriver = useWatch({
    control,
    name: 'kmForDriver',
  });

  const actualKm = useWatch({
    control,
    name: 'actualKm',
  });

  const statuses: OrderStatus[] = useMemo(() => {
    if (isDispatcher) {
      return Object.keys(OrderStatus).filter((s) => s !== 'SETTLED') as OrderStatus[];
    }

    return Object.keys(OrderStatus) as OrderStatus[];
  }, [isDispatcher]);

  return (
    <FormField
      control={control}
      name='status'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select
            onValueChange={(e) => field.onChange(e as OrderStatus)}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  disabled={checkIfStatusChangeIsForbidden({
                    providedStatus: status,
                    currentStatus,
                    kmForDriver,
                    actualKm,
                  })}
                >
                  {statusLabelPerStatus[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
