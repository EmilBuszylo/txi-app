import { accessControl } from '@/lib/server/utils/access-control';

import { CollectionPointsTable } from '@/components/features/collection-points/collection-points-table/CollectionPointsTable';

import { UserRole } from '@/server/users/user';

export default async function CollectionPoints() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <CollectionPointsTable />;
}
