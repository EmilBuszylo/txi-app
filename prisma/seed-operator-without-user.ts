import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const operatorsList = [
  {
    name: 'Uber/Bolt',
  },
];
async function main() {
  for await (const operator of operatorsList) {
    await prisma.operator.create({
      data: {
        name: operator.name,
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
