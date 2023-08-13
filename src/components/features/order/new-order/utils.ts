import { OrderDetailsFormDefaultValues } from '@/components/features/order/order-details/DetailsForm';

export const allowCalculation = ({
  locationFrom,
  locationTo,
  locationVia,
}: Pick<OrderDetailsFormDefaultValues, 'locationFrom' | 'locationVia' | 'locationTo'>) => {
  const viaPoints = locationVia && locationVia.length > 0 ? [...locationVia] : [];
  const locationsData = [locationFrom, ...viaPoints, locationTo];

  return locationsData.filter((l) => l?.address?.lat && l.address?.lng).length >= 2;
};
