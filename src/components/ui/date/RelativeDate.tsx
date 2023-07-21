import { formatDate, relativeDate } from '@/lib/helpers/date';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { dateFormats } from '@/constant/date-formats';

export interface RelativeDateProps {
  date: string | Date;
  tooltipPrefix?: string;
}

export function RelativeDate({ date, tooltipPrefix }: RelativeDateProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{relativeDate(date)}</TooltipTrigger>
        <TooltipContent>
          {tooltipPrefix}
          {formatDate(date, dateFormats.dateWithTimeFull)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
