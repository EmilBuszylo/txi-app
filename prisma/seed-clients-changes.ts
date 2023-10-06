import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const clientsList = [
  {
    name: 'Captrain',
    fullName: 'CAPTRAIN POLSKA sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'CargoWay',
    fullName: 'CARGOWAY sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'Tekol',
    fullName: 'TEKOL sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'HSL',
    fullName: 'HSL POLSKA sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'Cargo Przewozy Towarowe',
    fullName: 'CARGO PRZEWOZY TOWAROWE',
    login: '',
    password: '',
  },
  {
    name: 'Ost-West',
    fullName: 'OST-WEST LOGISTIC POLAND sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'LTG',
    fullName: 'LTG CARGO POLSKA sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'PCC',
    fullName: 'PCC INTERMODAL spółka akcyjna',
    login: '',
    password: '',
  },
  {
    name: 'Laude',
    fullName: 'LAUDE SMART INTERMODAL',
    login: '',
    password: '',
  },

  {
    name: 'Koltar',
    fullName: 'GRUPA AZOTY "KOLTAR" sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'Orion',
    fullName: 'ORION RAIL LOGISTICS',
    login: '',
    password: '',
  },
  {
    name: 'Railpolonia',
    fullName: 'RAILPOLONIA sp. z o.o.',
    login: '',
    password: '',
  },
  {
    name: 'TXI',
    fullName: 'TXI Szymon Warzycha',
    login: '',
    password: '',
  },
  {
    name: 'Ecco',
    fullName: 'ECCO RAIL sp. z o.o.',
    login: '',
    password: '',
  },
];
async function main() {
  for await (const client of clientsList) {
    await prisma.user.upsert({
      where: {
        login: client.name,
      },
      update: {
        login: client.login,
        password: client.password,
        role: 'CLIENT',
        client: {
          connectOrCreate: {
            where: {
              name: client.name,
              fullName: client.fullName,
            },
            create: {
              name: client.name,
              fullName: client.fullName,
            },
          },
        },
      },
      create: {
        login: client.login,
        password: client.password,
        role: 'CLIENT',
        client: {
          connectOrCreate: {
            where: {
              name: client.name,
              fullName: client.fullName,
            },
            create: {
              name: client.name,
              fullName: client.fullName,
            },
          },
        },
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
