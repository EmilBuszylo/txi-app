import { PrismaClient } from '@prisma/client';

import { LocationFrom, LocationVia } from '@/server/orders/order';
const prisma = new PrismaClient();

async function main() {
  const ordersList = await prisma.order.findMany();

  for await (const order of ordersList) {
    const locationFrom = order.locationFrom as LocationFrom;
    const locationVia = order.locationVia as LocationVia[];

    const locationFromAdditionals = locationFrom?.passenger?.additionalPassengers?.length
      ? locationFrom.passenger.additionalPassengers.map((el) => ({
          name: el.name,
        }))
      : [];

    const locationFromUpdated = locationFrom
      ? {
          ...locationFrom,
          passenger: {
            additionalPassengers: [
              {
                name: locationFrom.passenger.name,
                phone: locationFrom.passenger.phone,
              },
              ...locationFromAdditionals,
            ],
          },
        }
      : undefined;

    const locationViaUpdated = locationVia
      ? locationVia.map((el) => {
          const locationViaAdditionals = el?.passenger?.additionalPassengers?.length
            ? el.passenger.additionalPassengers.map((el) => ({
                name: el.name,
              }))
            : [];

          const firstPassenger = el.passenger?.name
            ? {
                name: el.passenger.name,
                phone: el.passenger?.phone,
              }
            : {};

          return {
            ...el,
            passenger: {
              additionalPassengers: [firstPassenger, ...locationViaAdditionals],
            },
          };
        })
      : undefined;

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        locationFrom: locationFromUpdated,
        locationVia: locationViaUpdated,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
