import { formatDate } from '@/lib/helpers/date';

import { dateFormats } from '@/constant/date-formats';
import { Order } from '@/server/orders/order';

export const getRealizationDate = (order: Order) => {
  if (order.locationFrom?.date) {
    return formatDate(order.locationFrom?.date, dateFormats.dateWithTime);
  }

  const viaPointWithDate = order.locationVia?.find((loc) => loc.date)?.date;

  if (viaPointWithDate) {
    return formatDate(viaPointWithDate, dateFormats.dateWithTime);
  }

  if (order.locationTo?.date) {
    return formatDate(order.locationTo?.date, dateFormats.dateWithTime);
  }

  return 'Nie podano';
};
