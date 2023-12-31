import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { getCurrentQueryParams } from '@/lib/queryParams';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface PaginationProps {
  currentPage: number;
  pagesCount: number;
  previousPage: () => void;
  nextPage: () => void;
  changePage: (page: number) => void;
  limit?: number;
  setLimit?: (limit: number) => void;
  isNoLimit?: boolean;
  setNoLimit?: (noLimit: boolean) => void;
  withQueryParams?: boolean;
  resetPage?: () => void;
}

const LIMITS = [10, 25, 50];

export function Pagination({
  currentPage,
  pagesCount,
  changePage,
  previousPage,
  nextPage,
  limit,
  setLimit,
  isNoLimit,
  setNoLimit,
  withQueryParams,
  resetPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChangeLimit = (limit: string) => {
    if (withQueryParams) {
      const params = getCurrentQueryParams(searchParams, ['limit'], { limit: limit });
      router.push(`${pathname}?${params}`);
    }
    resetPage?.();
    setLimit?.(Number(limit));
  };

  const handleNoLimit = () => {
    const newVal = !isNoLimit;
    if (withQueryParams) {
      const params = getCurrentQueryParams(searchParams, ['noLimit'], { noLimit: `${newVal}` });
      router.push(`${pathname}?${params}`);
    }
    resetPage?.();
    setNoLimit?.(newVal);
  };

  return (
    <TooltipProvider>
      <div className='flex flex-col gap-x-6 gap-y-4 md:flex-row md:items-center'>
        {typeof limit === 'number' && setLimit && (
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Liczba wierszy</p>
            <Select
              value={limit.toString()}
              onValueChange={(value) => handleChangeLimit(value)}
              disabled={isNoLimit}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={limit.toString()} />
              </SelectTrigger>
              <SelectContent side='top'>
                {LIMITS.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {typeof isNoLimit === 'boolean' && setNoLimit && (
          <div className='flex items-center space-x-3 space-y-0 text-sm'>
            <Checkbox checked={isNoLimit} onCheckedChange={handleNoLimit} />
            <p className='leading-none'>Wyświetl wszystko</p>
          </div>
        )}
        <div className='text-gray flex items-center gap-x-2'>
          <Tooltip>
            <TooltipContent>Prev</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={previousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
          </Tooltip>

          <div className='flex items-center gap-2 text-xs font-bold leading-normal'>
            <div>
              <label htmlFor='pagination' className='sr-only'>
                Aktualna strona
              </label>
              <select
                id='pagination'
                className='h-10 rounded border-gray-100 bg-white py-0 pl-2 pr-7 text-xs'
                value={currentPage}
                onChange={(event) => changePage(+event.target.value)}
              >
                {Array.from(Array(pagesCount).keys()).map((index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
            z <span>{pagesCount}</span>
          </div>

          <Tooltip>
            <TooltipContent>Next</TooltipContent>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={nextPage}
                disabled={currentPage === pagesCount}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default Pagination;
