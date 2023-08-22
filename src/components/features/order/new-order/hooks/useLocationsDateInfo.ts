import { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';

export const useLocationsDateInfo = ({ isClient }: { isClient: boolean }) => {
  const { watch, clearErrors } = useFormContext<OrderDetailsFormDefaultValues>();

  const [isFromDateFilled, setFromDateFilled] = useState<boolean>(false);
  const [isViaDateFilled, setViaDateFilled] = useState<boolean>(false);
  const [isToDateFilled, setToDateFilled] = useState<boolean>(false);

  const fromDateWatch = watch('locationFrom.date');
  const toDateWatch = watch('locationTo.date');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //  @ts-ignore
  const viaDateWatch = useWatch<OrderDetailsFormDefaultValues['locationVia']>({
    name: 'locationVia',
  });

  useEffect(() => {
    if (isFromDateFilled || isViaDateFilled || isToDateFilled) {
      clearErrors(['locationFrom.date', 'locationTo.date']);
    }
  }, [clearErrors, isFromDateFilled, isToDateFilled, isViaDateFilled]);

  return useMemo(() => {
    if (isClient) {
      setFromDateFilled(!!fromDateWatch);
      setToDateFilled(!!toDateWatch);
      const locationViaDateWatch = viaDateWatch;
      setViaDateFilled(
        locationViaDateWatch ? !locationViaDateWatch.every((loc) => !loc?.date) : false
      );
    }

    return {
      isFromDateFilled,
      isViaDateFilled,
      isToDateFilled,
    };
  }, [
    fromDateWatch,
    isClient,
    isFromDateFilled,
    isToDateFilled,
    isViaDateFilled,
    toDateWatch,
    viaDateWatch,
  ]);
};
