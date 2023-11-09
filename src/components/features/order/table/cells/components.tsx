import React from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const DisableCellEditionTooltip = ({ value }: { value?: string | number | null }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <span>{value || 'Nie uzupełniono'}</span>
      </TooltipTrigger>
      <TooltipContent>Kurs zakończony i rozliczony, nie można edytować pola</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
