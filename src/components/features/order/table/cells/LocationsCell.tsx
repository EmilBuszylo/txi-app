import { Row } from '@tanstack/table-core';

import { removeCountriesFromLocationString } from '@/lib/helpers/locations';

import { ColumnWithTooltip } from '@/components/ui/data-table/columns/ColumnWithTooltip';

import { Order } from '@/server/orders/order';

export const LocationsCell = ({ row }: { row: Row<Order> }) => {
  return (
    <ColumnWithTooltip
      trigger={
        <span
          className='text-ellipsis text-left line-clamp-1'
          dangerouslySetInnerHTML={{ __html: createLocationsString(row.original) }}
        />
      }
      content={
        <div
          className='flex flex-wrap items-center gap-x-1'
          dangerouslySetInnerHTML={{ __html: createLocationsString(row.original) }}
        />
      }
    />
  );
};

export const createLocationsString = (order: Order) => {
  const locationsVia = order.locationVia
    ?.map((loc) => loc.address.fullAddress)
    .join('<strong> -> </strong>');

  let locationsString = '';

  if (order.locationFrom?.address.fullAddress) {
    locationsString += `${order.locationFrom.address.fullAddress} <strong> -> </strong> `;
  }

  if (locationsVia) {
    locationsString += `${locationsVia} <strong> -> </strong> `;
  }

  if (order.locationTo?.address.fullAddress) {
    locationsString += order.locationTo?.address.fullAddress;
  }

  return removeCountriesFromLocationString(locationsString);
};
