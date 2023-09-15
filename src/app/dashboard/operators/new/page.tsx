import { accessControl } from '@/lib/server/utils/access-control';

import { NewOperatorForm } from '@/components/features/operator/new-operator/NewOperatorForm';

import { UserRole } from '@/server/users/user';

export default async function CreateNewOperator() {
  await accessControl({ allowedRoles: [UserRole.ADMIN, UserRole.DISPATCHER] });

  return <NewOperatorForm />;
}
