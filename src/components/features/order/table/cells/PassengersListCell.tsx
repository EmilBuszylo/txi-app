import { Row } from '@tanstack/table-core';
import { MoreHorizontal } from 'lucide-react';

import { ColumnWithTooltip } from '@/components/ui/data-table/columns/ColumnWithTooltip';

import { Order } from '@/server/orders/order';

export const PassengersListCell = ({ row }: { row: Row<Order> }) => {
  const locationFromPassengers = [
    row.original.locationFrom.passenger.name,
    ...getFromAdditionalPassengers(row.original.locationFrom.passenger.additionalPassengers),
  ];

  const locationViaPassengers = row.original.locationVia?.length
    ? row.original.locationVia
        ?.map((l) => [
          l.passenger?.name,
          ...getFromAdditionalPassengers(l.passenger?.additionalPassengers),
        ])
        .flat(1)
    : [];

  const allPassengers = [...locationFromPassengers, ...locationViaPassengers].filter((el) => el);

  return (
    <ColumnWithTooltip
      trigger={
        <div className='flex min-w-[180px] flex-col gap-y-1 text-left'>
          {allPassengers.map((p, i) => {
            if (i + 1 < 3) {
              return <span key={`${p}${i}`}>{p}</span>;
            }

            if (i + 1 === 3) {
              return <MoreHorizontal key={`${p}${i}`} />;
            }

            return null;
          })}
        </div>
      }
      content={
        <div className='flex flex-col gap-y-2'>
          {allPassengers.map((p, i) => (
            <span key={`${p}${i}`}>{p}</span>
          ))}
        </div>
      }
    />
  );
};

export const getFromAdditionalPassengers = (passengers?: { name?: string }[] | null) => {
  if (!passengers) return [];

  return passengers.map((p) => p.name);
};
