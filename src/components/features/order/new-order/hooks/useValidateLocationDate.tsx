import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { CreateOrderParams } from '@/lib/server/api/endpoints';

import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';

export const useValidateLocationDate = (
  form: UseFormReturn<CreateOrderParams> | UseFormReturn<OrderDetailsFormDefaultValues>,
  isClient?: boolean
) => {
  const { getValues, setError } = form;

  const setLocationDateError = useCallback(() => {
    const values = getValues();
    const isLocationViaFilled = values?.locationVia?.some((loc) => loc?.date);

    const locationDateFilledFields = [
      isLocationViaFilled,
      Boolean(values?.locationFrom?.date),
      Boolean(values?.locationTo?.date),
    ].filter((loc) => loc).length;

    if (locationDateFilledFields === 0) {
      setError('locationFrom.date', {
        type: 'custom',
        message:
          'Przynajmniej jedna data z pośród sekcji z "Miejsce odbioru", "Miejsce docelowe", "Lokalizacja pośrednia" musi być uzupełniona.',
      });
      setError('locationTo.date', {
        type: 'custom',
        message:
          'Przynajmniej jedna data z pośród sekcji z "Miejsce odbioru", "Miejsce docelowe", "Lokalizacja pośrednia" musi być uzupełniona.',
      });

      return true;
    }

    if (isClient) {
      if (locationDateFilledFields > 1) {
        setError('locationFrom.date', {
          type: 'custom',
          message:
            'Tylko data z jednej sekcji z "Miejsce odbioru", "Miejsce docelowe", "Lokalizacja pośrednia" może być uzupełniona.',
        });
        setError('locationTo.date', {
          type: 'custom',
          message:
            'Tylko data z jednej sekcji z "Miejsce odbioru", "Miejsce docelowe", "Lokalizacja pośrednia" może być uzupełniona.',
        });

        return true;
      }

      return false;
    }
  }, [getValues, isClient, setError]);

  return { setLocationDateError };
};
