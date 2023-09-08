import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const dispatchersList = [
  {
    firstName: 'Dyspozytor',
    lastName: 'Testowy',
    email: 'emil.interesy@gmail.com',
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
        password: '!@Test1234',
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
