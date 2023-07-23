import { Row } from '@tanstack/table-core';
import { parsePhoneNumber } from 'awesome-phonenumber';

import { Driver } from '@/server/drivers/driver';

export const PhoneCell = ({ row }: { row: Row<Driver> }) => {
  const phone = row.original.phone ? parsePhoneNumber(row.original.phone) : undefined;

  return <span>{phone?.valid ? phone.number.international : ''}</span>;
};
