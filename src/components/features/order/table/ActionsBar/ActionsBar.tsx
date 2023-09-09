import { PopoverClose } from '@radix-ui/react-popover';
import { Banknote, Car, CheckSquare, FileInput, LucideIcon, XIcon } from 'lucide-react';
import { MouseEvent, PropsWithChildren, useRef } from 'react';

import { cn } from '@/lib/utils';

import { AcceptKmDifferenceForm } from '@/components/features/order/table/ActionsBar/actions/AcceptKmDifferenceForm';
import { AddClientInvoiceForm } from '@/components/features/order/table/ActionsBar/actions/AddClientInvoiceForm';
import { AddDriverInvoiceFrom } from '@/components/features/order/table/ActionsBar/actions/AddDriverInvoiceForm';
import { ClientPayedForm } from '@/components/features/order/table/ActionsBar/actions/ClientPayedForm';
import { CsvImportButton } from '@/components/features/order/table/ActionsBar/actions/CsvImportButton';
import { ActionsBarProps } from '@/components/ui/data-table/data-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Order } from '@/server/orders/order';

export const ActionsBar = ({
  clearSelection,
  selectedAmount,
  params,
  allItemsAmount,
  selectedItems,
}: ActionsBarProps<Order[]>) => {
  const ref = useRef<HTMLButtonElement>(null);
  const onSuccessAction = () => {
    clearSelection();
    ref.current?.focus?.();
  };

  return (
    <div className='flex items-center gap-x-1'>
      <TooltipProvider>
        <ActionButtonWithPopover
          icon={FileInput}
          label='Wprowdź fakturę'
          isDisabled={!selectedAmount}
        >
          <AddClientInvoiceForm
            ids={selectedItems.map((item) => item.id)}
            onSuccess={onSuccessAction}
            params={params}
          />
        </ActionButtonWithPopover>
        <ActionButtonWithPopover
          icon={Car}
          label='Ureguluj płatność za kurs z kierowcą'
          isDisabled={!selectedAmount}
        >
          <AddDriverInvoiceFrom
            ids={selectedItems.map((item) => item.id)}
            params={params}
            onSuccess={onSuccessAction}
          />
        </ActionButtonWithPopover>
        <ActionButtonWithPopover
          icon={Banknote}
          label='Zatwierdź płatność za kurs'
          isDisabled={!selectedAmount}
        >
          <ClientPayedForm
            ids={selectedItems.map((item) => item.id)}
            params={params}
            onSuccess={onSuccessAction}
          />
        </ActionButtonWithPopover>
        <CsvImportButton selectedAmount={selectedAmount} selectedItems={selectedItems} />
        <ActionButtonWithPopover
          label='Zaakceptuj różnice w KM'
          icon={CheckSquare}
          isDisabled={!selectedAmount}
        >
          <AcceptKmDifferenceForm
            ids={selectedItems.map((item) => item.id)}
            params={params}
            onSuccess={onSuccessAction}
          />
        </ActionButtonWithPopover>
      </TooltipProvider>
      <div
        className={cn('flex-1 text-sm font-semibold text-gray-900', {
          'opacity-30': !selectedAmount,
        })}
      >
        wybranych {selectedAmount} z {allItemsAmount}
      </div>
      <button ref={ref} className='h-0 w-0' />
    </div>
  );
};

interface ActionButtonWithPopoverProps {
  label: string;
  icon: LucideIcon;
  isDisabled: boolean;
}

export const ActionButtonWithPopover = ({
  label,
  children,
  icon: Icon,
  isDisabled,
}: PropsWithChildren<ActionButtonWithPopoverProps>) => {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          asChild
          disabled={isDisabled}
          className={cn({
            'cursor-not-allowed': isDisabled,
          })}
        >
          <PopoverTrigger asChild disabled={isDisabled}>
            <button
              disabled={isDisabled}
              className='group p-1 text-gray-900 focus-visible:outline-none disabled:opacity-30'
            >
              <span className='block rounded p-1 group-hover:bg-gray-800/10 group-focus-visible:bg-gray-800/20 group-active:bg-gray-800/20 group-disabled:bg-transparent'>
                <span className='sr-only'>{label}</span>
                <Icon />
              </span>
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
        <PopoverContent
          onClick={async (event) => {
            event.stopPropagation();
          }}
        >
          <div className='p-2'>
            <div className='flex w-full justify-end'>
              <PopoverClose>
                <XIcon />
              </PopoverClose>
            </div>
            {children}
          </div>
        </PopoverContent>
      </Tooltip>
    </Popover>
  );
};

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  isDisabled: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}

export const ActionButton = ({
  label,
  onClick,
  icon: Icon,
  isDisabled,
}: PropsWithChildren<ActionButtonProps>) => {
  return (
    <Tooltip>
      <TooltipTrigger
        asChild
        disabled={isDisabled}
        className={cn({
          'cursor-not-allowed': isDisabled,
        })}
      >
        <button
          onClick={onClick}
          disabled={isDisabled}
          className='group p-1 text-gray-900 focus-visible:outline-none disabled:opacity-30'
        >
          <span className='block rounded p-1 group-hover:bg-gray-800/10 group-focus-visible:bg-gray-800/20 group-active:bg-gray-800/20 group-disabled:bg-transparent'>
            <span className='sr-only'>{label}</span>
            <Icon />
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
