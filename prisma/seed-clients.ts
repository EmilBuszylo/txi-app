import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const clientsList = [
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
    await prisma.user.create({
      data: {
        login: client.login,
        password: client.password,
        role: 'CLIENT',
        client: {
          connectOrCreate: {
            where: {
              name: client.name,
            },
            create: {
              name: client.name,
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
