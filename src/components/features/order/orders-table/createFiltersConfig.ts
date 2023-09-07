import { statusLabelPerStatus } from '@/components/features/order/utils';

import { OrderStatus } from '@/server/orders/order';

type OptionsData = { label: string; value: string }[];

export const createFiltersConfig = ({
  clientsData,
  driversData,
}: {
  clientsData: OptionsData;
  driversData: OptionsData;
}) => {
  return [
    {
      title: 'Status',
      name: 'status',
      options: [
        {
          label: statusLabelPerStatus[OrderStatus.NEW],
          value: OrderStatus.NEW,
        },
        {
          label: statusLabelPerStatus[OrderStatus.STARTED],
          value: OrderStatus.STARTED,
        },
        {
          label: statusLabelPerStatus[OrderStatus.IN_PROGRESS],
          value: OrderStatus.IN_PROGRESS,
        },
        {
          label: statusLabelPerStatus[OrderStatus.COMPLETED],
          value: OrderStatus.COMPLETED,
        },
        {
          label: statusLabelPerStatus[OrderStatus.CANCELLED],
          value: OrderStatus.CANCELLED,
        },
      ],
    },
    {
      title: 'Klient',
      name: 'clientName',
      options: clientsData,
    },
    {
      title: 'Kierowca',
      name: 'driverId',
      options: driversData,
    },
    {
      title: 'Rzeczywiste Km',
      name: 'hasActualKm',
      options: [
        {
          label: 'Uzupełnione',
          value: 'true',
        },
        {
          label: 'Nie uzupełnione',
          value: 'false',
        },
      ],
    },
    {
      title: 'Faktura klienta',
      name: 'haClientInvoice',
      options: [
        {
          label: 'Dodana',
          value: 'true',
        },
        {
          label: 'Nie dodana',
          value: 'false',
        },
      ],
    },
  ];
};
