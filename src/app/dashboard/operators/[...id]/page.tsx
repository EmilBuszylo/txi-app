import { accessControl } from '@/lib/server/utils/access-control';

import OperatorDetails from '@/components/features/operator/operator-details/OperatorDetails';

import { UserRole } from '@/server/users/user';

export default async function OperatorDetailsPage() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <OperatorDetails />;
}
