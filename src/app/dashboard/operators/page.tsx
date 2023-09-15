import { accessControl } from '@/lib/server/utils/access-control';

import { OperatorsTable } from '@/components/features/operator/operators-table/OperatorsTable';

import { UserRole } from '@/server/users/user';

export default async function Page() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <OperatorsTable />;
}
