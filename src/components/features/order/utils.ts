import { OrderStatus } from '@/server/orders/order';

export const statusLabelPerStatus: Record<OrderStatus, string> = {
  NEW: 'Nowe',
  STARTED: 'Wydane',
  IN_PROGRESS: 'W toku',
  COMPLETED: 'Zakończone',
  CANCELLED: 'Anulowane',
};

export const clientStatusLabelPerStatus: Record<OrderStatus, string> = {
  NEW: 'Nowe',
  STARTED: 'Przyjęto',
  IN_PROGRESS: 'W toku',
  COMPLETED: 'Zakończone',
  CANCELLED: 'Anulowane',
};
