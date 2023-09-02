import { PrismaClient } from '@prisma/client';

import { LocationFrom } from '@/server/orders/order';
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      locationFrom: true,
      locationVia: true,
    },
  });

  for await (const order of orders) {
    const oldLocationFrom = order.locationFrom as LocationFrom;
    const oldLocationVia = order.locationVia as LocationFrom[];
    const locationFrom: LocationFrom = {
      ...oldLocationFrom,
      passenger: {
        ...oldLocationFrom.passenger,
        name: `${oldLocationFrom.passenger.firstName} ${oldLocationFrom.passenger.lastName}`,
      },
    };

    const locationVia: LocationFrom[] = oldLocationVia.map((el) => ({
      ...el,
      passenger: {
        ...el.passenger,
        name: `${el.passenger.firstName} ${el.passenger.lastName}`,
      },
    }));

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        locationFrom,
        locationVia,
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
