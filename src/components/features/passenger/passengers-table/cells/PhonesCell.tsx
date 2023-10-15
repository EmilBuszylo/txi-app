import { Row } from '@tanstack/table-core';
import { parsePhoneNumber } from 'awesome-phonenumber';

import { Passenger } from '@/server/passengers/passenger';

export const PhonesCell = ({ row }: { row: Row<Passenger> }) => {
  const phones = row.original.phones
    ? row.original.phones.map((phone, index) => ({ phone: parsePhoneNumber(phone), id: index }))
    : undefined;

  return (
    <span>
      {phones?.map((phone) => (
        <div key={phone.id}>{phone.phone?.valid ? phone.phone.number.international : ''}</div>
      ))}
    </span>
  );
};
