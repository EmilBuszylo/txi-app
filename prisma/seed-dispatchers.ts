import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const dispatchersList = [
  {
    firstName: 'Błażej',
    lastName: 'Borzym',
    email: 'blazejborzym@o2.pl',
    password: 'cdV267#w',
  },
  {
    firstName: 'Piotr',
    lastName: 'Kuchta',
    email: 'malpka503@wp.pl',
    password: '5pc=8XK7',
  },
];
async function main() {
  for await (const dispatcher of dispatchersList) {
    await prisma.user.create({
      data: {
        login: dispatcher.email,
        firstName: dispatcher.firstName,
        lastName: dispatcher.lastName,
        email: dispatcher.email,
        password: dispatcher.password,
        role: 'DISPATCHER',
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
