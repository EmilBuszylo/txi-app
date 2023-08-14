import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const operatorsList = [
  {
    name: 'Szymon Warzycha',
  },
  {
    name: 'Łukasz Kupczyk',
  },
  {
    name: 'Michał Drozdowski',
  },
  {
    name: 'Mariusz Hoppel',
  },
  {
    name: 'Waldemar Sorek',
  },
  {
    name: 'Bartłomiej Kurdziel',
  },
  {
    name: 'Adam Sobolewski',
  },
  {
    name: 'Elżbieta Nowicka - Wem',
  },
  {
    name: 'Maciej Kucharski Szczecin',
  },
  {
    name: 'Marcin Kowalski Alkar',
  },
  {
    name: 'Damian Olszowy',
  },
  {
    name: 'Kinga Kościerzyna',
  },
  {
    name: 'Adam Krzemiński Strzebiń',
  },
  {
    name: 'Dominik Peh Lublin',
  },
  {
    name: 'Łukasz Wojtynów Legnica',
  },
  {
    name: 'Wojciech Szczecinek',
  },
  {
    name: 'Jarosław Kacała TaxiVel',
  },
  {
    name: 'Igor Warszawa',
  },
  {
    name: 'Andrzej Pszech',
  },
  {
    name: 'Marcin Kamrowski',
  },

  {
    name: 'Wiesław Krawczyk',
  },
  {
    name: 'Witek Naumczyk',
  },
  {
    name: 'Krzysztof Ząbkowice Śląskie',
  },
  {
    name: 'Tadeusz Kłodzko',
  },
  {
    name: 'Karolina Gdańsk',
  },
  {
    name: 'Paweł Gajewski',
  },
  {
    name: 'Jarek Gdańsk',
  },
];
async function main() {
  for await (const operator of operatorsList) {
    await prisma.operator.create({
      data: {
        name: operator.name,
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
