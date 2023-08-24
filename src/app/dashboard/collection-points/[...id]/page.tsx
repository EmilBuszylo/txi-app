import { accessControl } from '@/lib/server/utils/access-control';

import { CollectionPointDetails } from '@/components/features/collection-points/collection-point-details/CollectionPointDetails';

import { UserRole } from '@/server/users/user';

export default async function CollectionPointDetailsPage() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <CollectionPointDetails />;
}
