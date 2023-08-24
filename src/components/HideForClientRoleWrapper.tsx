import { ReactNode } from 'react';

import { UseIsClientRole } from '@/lib/hooks/useIsClientRole';

export const HideForClientRoleWrapper = ({ children }: { children: ReactNode }) => {
  const { isClient } = UseIsClientRole();

  return !isClient ? children : null;
};
