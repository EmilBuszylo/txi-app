import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
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
    const hashed_password = await hash(dispatcher.password, 12);

    await prisma.user.update({
      where: {
        email: dispatcher.email,
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
