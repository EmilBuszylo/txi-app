import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface PaginationProps {
  currentPage: number;
  pagesCount: number;
  previousPage: () => void;
  nextPage: () => void;
  changePage: (page: number) => void;
}

export function Pagination({
  currentPage,
  pagesCount,
  changePage,
  previousPage,
  nextPage,
}: PaginationProps) {
  return (
    <TooltipProvider>
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
              Current page
            </label>
            <select
              id='pagination'
              className='h-6 rounded border-gray-100 bg-white py-0 pl-2 pr-7 text-xs'
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
          of {pagesCount}
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
    </TooltipProvider>
  );
}

export default Pagination;
