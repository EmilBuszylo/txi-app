import { PrismaClient } from '@prisma/client';

import { LocationFrom, LocationVia } from '@/server/orders/order';
const prisma = new PrismaClient();

async function main() {
  const ordersList = await prisma.order.findMany();

  for await (const order of ordersList) {
    const locationFrom = order.locationFrom as LocationFrom;
    const locationVia = order.locationVia as LocationVia[];

    const locationFromUpdated = {
      ...locationFrom,
      passenger: {
        ...locationFrom.passenger,
        additionalPassengers: locationFrom.passenger?.additionalPassengers?.map((el) => ({
          ...el,
          type: 'custom',
        })),
      },
    };

    const locationViaUpdated = locationVia.map((el) => ({
      ...el,
      passenger: {
        ...el.passenger,
        additionalPassengers: el.passenger?.additionalPassengers?.map((el) => ({
          ...el,
          type: 'custom',
        })),
      },
    }));

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
