// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
//
// async function main() {
//
//   const operatorsList = await prisma.operator.findMany()
//
//   for await (const operator of operatorsList) {
//     await prisma.user.create({
//
//       data: {
//         login: operator.name,
//         password:
//       },
//     });
//   }
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     // eslint-disable-next-line no-console
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
