import { OrderStatus } from '@/server/orders/order';

export const statusLabelPerStatus: Record<OrderStatus, string> = {
  NEW: 'Nowe',
  STARTED: 'Wydane',
  IN_PROGRESS: 'W toku',
  COMPLETED: 'Zakończone',
  CANCELLED: 'Anulowane',
};
