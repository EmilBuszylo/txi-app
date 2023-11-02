import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

const dispatchersList = [
  {
    email: 'dyspozytura.txi@gmail.com',
    password: '_',
  },
];
async function main() {
  for await (const dispatcher of dispatchersList) {
    const hashed_password = await hash(dispatcher.password, 12);

    await prisma.user.update({
      where: {
        login: dispatcher.email,
      },
      data: {
        password: hashed_password,
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
