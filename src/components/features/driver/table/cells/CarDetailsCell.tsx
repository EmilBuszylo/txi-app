import { Row } from '@tanstack/table-core';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Driver } from '@/server/drivers/driver';

export const CarDetailsCell = ({ row }: { row: Row<Driver> }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className='grid min-w-[350px] grid-cols-2 items-center justify-start'>
            <div className='flex-start flex max-w-[190px]'>
              <span className='mr-1 font-semibold'>Marka:</span>
              <span className='truncate'>{row.original?.driverDetails?.carBrand || '-'}</span>
            </div>
            <div className='flex-start flex max-w-[190px]'>
              <span className='mr-1 font-semibold'>Model:</span>
              <span className='truncate'> {row.original.driverDetails?.carModel || '-'}</span>
            </div>
            <div className='flex-start flex max-w-[190px]'>
              <span className='mr-1 font-semibold'>Kolor:</span>
              <span className='truncate'> {row.original.driverDetails?.carColor || '-'}</span>
            </div>
            <div className='flex-start flex max-w-[210px] whitespace-nowrap break-keep'>
              <span className='mr-1 font-semibold'>Nr rejestracyjny:</span>
              <span className='truncate'>
                {row.original.driverDetails?.carRegistrationNumber || '-'}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <ul className='list-none gap-y-2'>
            <li>
              <span className='mr-1 font-semibold'>Marka:</span>
              {row.original.driverDetails?.carBrand || '-'}
            </li>
            <li>
              <span className='mr-1 font-semibold'>Model:</span>
              {row.original.driverDetails?.carModel || '-'}
            </li>
            <li>
              <span className='mr-1 font-semibold'>Kolor:</span>
              {row.original.driverDetails?.carColor || '-'}
            </li>
            <li>
              <span className='mr-1 font-semibold'>Nr rejestracyjny:</span>
              {row.original.driverDetails?.carRegistrationNumber || '-'}
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
