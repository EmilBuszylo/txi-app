import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

const dispatchersList = [
  {
    firstName: undefined,
    lastName: undefined,
    email: 'dyspozytura.txi@gmail.com',
    password: '_',
  },
];
async function main() {
  for await (const dispatcher of dispatchersList) {
    const hashed_password = await hash(dispatcher.password, 12);

    await prisma.user.create({
      data: {
        login: dispatcher.email,
        firstName: dispatcher.firstName,
        lastName: dispatcher.lastName,
        email: dispatcher.email,
        password: hashed_password,
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
