import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { subDays } from 'date-fns';
async function main() {
  const orders = await prisma.order.findMany({ select: { id: true } });
  let index = 1;
  for await (const order of orders) {
    const newdate = await subDays(new Date(), index);

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        shipmentToDriverAt: newdate,
      },
    });

    index++;
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
