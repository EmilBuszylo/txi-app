import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const clientsList = [
  {
    name: 'Ecco',
    fullName: 'ECCO RAIL sp. z o.o.',
    login: 'ecco_rail',
    password: '8bef[26K',
  },
  {
    name: 'Captrain',
    login: '',
    password: '',
  },
  {
    name: 'CargoWay',
    login: '',
    password: '',
  },
  {
    name: 'Tekol',
    login: '',
    password: '',
  },
  {
    name: 'HSL',
    login: '',
    password: '',
  },
  {
    name: 'Cargo Przewozy Towarowe',
    login: '',
    password: '',
  },
  {
    name: 'Ost-West',
    login: '',
    password: '',
  },
  {
    name: 'LTG',
    login: '',
    password: '',
  },
  {
    name: 'PCC',
    login: '',
    password: '',
  },
  {
    name: 'Laude',
    login: '',
    password: '',
  },
];

async function main() {
  for await (const client of clientsList) {
    await prisma.client.upsert({
      where: {
        name: client.name,
      },
      create: {
        name: client.name,
        fullName: client.fullName,
      },
      update: {
        name: client.name,
        fullName: client.fullName,
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
