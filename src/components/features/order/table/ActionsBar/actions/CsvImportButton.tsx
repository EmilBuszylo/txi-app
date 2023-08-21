import { Parser } from '@json2csv/plainjs';
import { FileSpreadsheet } from 'lucide-react';
import { MouseEvent } from 'react';

import { downloadFile } from '@/lib/helpers/downloadFile';

import { ActionButton } from '@/components/features/order/table/ActionsBar/ActionsBar';
import { translateOrderItemKeys } from '@/components/features/order/table/ActionsBar/translateOrderItemKey';
import { ActionsBarProps } from '@/components/ui/data-table/data-table';

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
              if (
                itemKey === 'locationFrom' ||
                itemKey === 'locationTo' ||
                itemKey === 'collectionPoint'
              ) {
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
              } else {
                newItems[translateOrderItemKeys[itemKey as keyof typeof translateOrderItemKeys]] =
                  item[itemKey as keyof Order];
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
