import { accessControl } from '@/lib/server/utils/access-control';

import { NewCollectionPoint } from '@/components/features/collection-points/NewCollectionPoint/NewCollectionPoint';

import { UserRole } from '@/server/users/user';

export default async function CreateNewCollectionPoint() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <NewCollectionPoint />;
}
