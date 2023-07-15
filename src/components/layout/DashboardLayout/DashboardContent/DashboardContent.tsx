import { PropsWithChildren, ReactElement } from 'react';

import LeftSidebar from '@/components/layout/DashboardLayout/DashboardContent/LeftSidebar';
import { RightSidebar } from '@/components/layout/DashboardLayout/DashboardContent/RightSidebar';

interface DashboardContentProps {
  sidebar?: ReactElement;
  additionalInfo?: ReactElement;
}

export function DashboardContent({
  additionalInfo,
  children,
  sidebar,
}: PropsWithChildren<DashboardContentProps>) {
  return (
    <div className='relative flex min-h-0 w-full flex-1 items-stretch divide-gray-100 overflow-hidden border-gray-100 lg:divide-x lg:border-t'>
      {sidebar && <LeftSidebar>{sidebar}</LeftSidebar>}

      <div className='relative flex min-w-0 flex-1 flex-col gap-4 overflow-auto bg-blue-50 p-4'>
        {children}
      </div>

      {additionalInfo && <RightSidebar>{additionalInfo}</RightSidebar>}
    </div>
  );
}

export default DashboardContent;
