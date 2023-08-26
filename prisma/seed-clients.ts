import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const clientsList = [
  {
    name: 'Klient Testowy',
  },
  // {
  //   name: 'Captrain',
  // },
  // {
  //   name: 'CargoWay',
  // },
  // {
  //   name: 'Tekol',
  // },
  // {
  //   name: 'HSL',
  // },
  // {
  //   name: 'Cargo Przewozy Towarowe',
  // },
  // {
  //   name: 'Ost-West',
  // },
  // {
  //   name: 'LTG',
  // },
  // {
  //   name: 'PCC',
  // },
  // {
  //   name: 'Laude',
  // },
];
async function main() {
  for await (const client of clientsList) {
    await prisma.client.create({
      data: {
        name: client.name,
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
