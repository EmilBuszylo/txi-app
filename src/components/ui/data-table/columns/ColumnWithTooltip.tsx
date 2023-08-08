import { ReactElement } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ColumnWithTooltipProps {
  trigger: ReactElement;
  content: ReactElement;
}

export const ColumnWithTooltip = ({ trigger, content }: ColumnWithTooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
