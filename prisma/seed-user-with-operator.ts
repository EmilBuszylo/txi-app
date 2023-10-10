import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

const operatorsList = [
  {
    name: 'Szymon Warzycha',
    login: 'testowy-operator',
    password: '----',
  },
];
async function main() {
  for await (const operator of operatorsList) {
    const hashed_password = await hash(operator.password, 12);

    await prisma.user.upsert({
      where: {
        login: operator.login,
      },
      create: {
        login: operator.login,
        password: hashed_password,
        role: 'OPERATOR',
        operator: {
          connectOrCreate: {
            where: {
              name: operator.name,
            },
            create: {
              name: operator.name,
            },
          },
        },
      },
      update: {
        login: operator.login,
        password: hashed_password,
        role: 'OPERATOR',
        operator: {
          connectOrCreate: {
            where: {
              name: operator.name,
            },
            create: {
              name: operator.name,
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
