import { Row } from '@tanstack/table-core';

import { statusLabelPerStatus } from '@/components/features/order/utils';
import { Badge } from '@/components/ui/badge';

import { Order, OrderStatus } from '@/server/orders/order';

export const StatusCell = ({ row }: { row: Row<Order> }) => {
  return (
    <Badge className={statusOnBadgeStyle[row.original.status]}>
      {statusLabelPerStatus[row.original.status]}
    </Badge>
  );
};

export const statusOnBadgeStyle: Record<OrderStatus, string> = {
  NEW: 'border-transparent bg-green-600 text-white hover:bg-green-600/80',
  STARTED: 'border-transparent bg-blue-600 text-white hover:bg-blue-600/80',
  IN_PROGRESS: 'border-transparent bg-orange-600 text-white hover:bg-orange-600/80',
  CANCELLED:
    'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
  COMPLETED: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
};
