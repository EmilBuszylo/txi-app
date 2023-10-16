import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

const operatorsList = [
  {
    name: 'Jędrzej Kołodziej',
    firstName: 'Jędrzej',
    lastName: 'Kołodziej',
    login: 'jedrzej_kolodziej',
    password: '-',
  },
  {
    name: 'Kacper Bydgoszcz',
    firstName: 'Kacper',
    lastName: 'Hinc',
    login: 'kacper_hinc',
    password: '-',
  },
  {
    name: 'Jan Bydgoszcz',
    firstName: 'Jan',
    lastName: 'Lisek',
    login: 'jan_lisek',
    password: '-',
  },
  {
    name: 'Dawid Glazik Gdańsk',
    firstName: 'Dawid',
    lastName: 'Glazik',
    login: 'dawid_glazik',
    password: '-',
  },
];
async function main() {
  for await (const operator of operatorsList) {
    const hashed_password = await hash(operator.password, 12);

    await prisma.user.create({
      data: {
        login: operator.login,
        firstName: operator.firstName,
        lastName: operator.lastName,
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
