import { Parser } from '@json2csv/plainjs';
import { FileSpreadsheet } from 'lucide-react';
import { MouseEvent } from 'react';

import { formatDate } from '@/lib/helpers/date';
import { downloadFile } from '@/lib/helpers/downloadFile';

import { ActionButton } from '@/components/features/order/table/ActionsBar/ActionsBar';
import { translateOrderItemKeys } from '@/components/features/order/table/ActionsBar/translateOrderItemKey';
import { ActionsBarProps } from '@/components/ui/data-table/data-table';

import { dateFormats } from '@/constant/date-formats';
import { CollectionPoint } from '@/server/collection-points.ts/collectionPoint';
import { Driver } from '@/server/drivers/driver';
import { LocationFrom, Order } from '@/server/orders/order';

type CsvImportButtonProps = Pick<ActionsBarProps<Order[]>, 'selectedItems' | 'selectedAmount'>;

export const CsvImportButton = ({ selectedAmount, selectedItems }: CsvImportButtonProps) => {
  const parser = new Parser();

  return (
    <ActionButton
      label='Pobierz tabele jako plik CSV'
      icon={FileSpreadsheet}
      isDisabled={!selectedAmount}
      onClick={(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        const parsedItems = selectedItems.map((item) => {
          const itemKeys = Object.keys(item);
          const newItems: Record<string, unknown> = {};

          for (const itemKey of itemKeys) {
            if (translateOrderItemKeys[itemKey as keyof typeof translateOrderItemKeys]) {
              if (itemKey === 'locationFrom' || itemKey === 'locationTo') {
                newItems[translateOrderItemKeys[itemKey as keyof typeof translateOrderItemKeys]] =
                  (item[itemKey as keyof Order] as unknown as LocationFrom)?.address?.fullAddress ||
                  '';
              } else if (
                itemKey === 'locationVia' &&
                typeof item[itemKey as keyof Order] === 'object'
              ) {
                let val = '';
                for (const via of item[itemKey as keyof Order] as unknown as LocationFrom[]) {
                  const fullAddress = via?.address?.fullAddress || '';

                  val = val === '' ? val + fullAddress : val + ' + ' + fullAddress;
                }

                newItems[translateOrderItemKeys[itemKey as keyof typeof translateOrderItemKeys]] =
                  val;
              } else if (itemKey === 'collectionPoint') {
                newItems[translateOrderItemKeys[itemKey as keyof typeof translateOrderItemKeys]] =
                  (item[itemKey as keyof Order] as unknown as CollectionPoint)?.fullAddress || '';
              } else if (itemKey === 'driver') {
                newItems[
                  translateOrderItemKeys[itemKey as keyof typeof translateOrderItemKeys]
                ] = `${(item[itemKey as keyof Order] as unknown as Driver).firstName} ${
                  (item[itemKey as keyof Order] as unknown as Driver).lastName
                }`;
              } else {
                newItems[translateOrderItemKeys[itemKey as keyof typeof translateOrderItemKeys]] =
                  parseCsvValue(item[itemKey as keyof Order], itemKey);
              }
            }
          }

          return newItems;
        });

        const csv = parser.parse(parsedItems);
        e.preventDefault();
        return downloadFile({
          data: csv,
          fileName: 'zlecenia.csv',
          fileType: 'text/csv',
        });
      }}
    />
  );
};

const parseCsvValue = (value: Order[keyof Order], keyName?: string): Order[keyof Order] => {
  if (typeof value === 'boolean') {
    return value ? 'Tak' : 'Nie';
  }

  if (keyName === 'createdAt' || keyName === 'updatedAt') {
    if (typeof value === 'string' || value instanceof Date)
      return formatDate(new Date(value), dateFormats.dateWithTimeFull);
  }

  return value;
};
