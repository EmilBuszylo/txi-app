import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
const prisma = new PrismaClient();

const operatorsList = [
  {
    name: 'Szymon Warzycha',
    firstName: 'Szymon',
    lastName: 'Warzycha',
    login: 'szymon_warzycha',
    password: '~678Ah',
  },
  {
    name: 'Łukasz Kupczyk',
    firstName: 'Łukasz',
    lastName: 'Kupczyk',
    login: 'lukasz_kupczyk',
    password: '38F{3s',
  },
  {
    name: 'Michał Drozdowski',
    firstName: 'Michał',
    lastName: 'Drozdowski',
    login: 'michal_drozdowski',
    password: '3(2X4v',
  },
  {
    name: 'Mariusz Hoppel',
    firstName: 'Mariusz',
    lastName: 'Hoppel',
    login: 'mariusz_hoppel',
    password: '35)2Mc',
  },
  {
    name: 'Waldemar Sorek',
    firstName: 'Waldemar',
    lastName: 'Sorek',
    login: 'waldemar_sorek',
    password: '83(Fm9',
  },
  {
    name: 'Bartłomiej Kurdziel',
    firstName: 'Bartłomiej',
    lastName: 'Kurdziel',
    login: 'bartlomiej_kurdziel',
    password: '87a1P-',
  },
  {
    name: 'Adam Sobolewski',
    firstName: 'Adam',
    lastName: 'Sobolewski',
    login: 'adam_sobolewski',
    password: '17%Qv6',
  },
  {
    name: 'Elżbieta Nowicka - Wem',
    firstName: 'Elżbieta',
    lastName: 'Nowicka - Wem',
    login: 'elzbieta_nowicka_wem',
    password: '2K-6c5',
  },
  {
    name: 'Bartek Dragan',
    firstName: 'Bartek',
    lastName: 'Dragan',
    login: 'bartosz_dragan',
    password: 'jE500]',
  },
  {
    name: 'Szymon Szczecin',
    firstName: 'Szymon',
    lastName: 'Szczecin',
    login: 'szymon_ambruzd',
    password: '2H{y39',
  },
  {
    name: 'Damian Olszowy',
    firstName: 'Damian',
    lastName: 'Olszowy',
    login: 'damian_olszowy',
    password: '#01Ty2',
  },
  {
    name: 'Kinga Kościerzyna',
    firstName: 'Kinga',
    lastName: 'Kościerzyna',
    login: 'kinga_gora',
    password: '/2mA27',
  },
  {
    name: 'Adam Krzemiński Strzebiń',
    firstName: 'Adam',
    lastName: 'Krzemiński Strzebiń',
    login: 'adam_krzeminski',
    password: 'p901R[',
  },
  {
    name: 'Arkadiusz Bydgoszcz',
    firstName: 'Arkadiusz',
    lastName: 'Bydgoszcz',
    login: 'arkadiusz_janiak',
    password: '5!6Ey8',
  },
  {
    name: 'Łukasz Wojtynów Legnica',
    firstName: 'Łukasz',
    lastName: 'Wojtynów Legnica',
    login: 'lukasz_wojtynow',
    password: '5?6Ey8',
  },
  {
    name: 'Wojciech Szczecinek',
    firstName: 'Szymon',
    lastName: 'Wojciech',
    login: 'wojciech_wolynski',
    password: '9gX7?0',
  },
  {
    name: 'Jarosław Kacała TaxiVel',
    firstName: 'Jarosław',
    lastName: 'Kacała TaxiVel',
    login: 'jaroslaw_kacala',
    password: '2j}29V',
  },
  {
    name: 'Krzysztof Lublin',
    firstName: 'Krzysztof',
    lastName: 'Gargol',
    login: 'krzysztof_gargol',
    password: 'xU(955',
  },
  {
    name: 'Andrzej Pszech',
    firstName: 'Andrzej',
    lastName: 'Pszech',
    login: 'andrzej_pszech',
    password: '^6B36b',
  },
  {
    name: 'Marcin Kamrowski',
    firstName: 'Marcin',
    lastName: 'Kamrowski',
    login: 'marcin_kamrowski',
    password: '9gX7!0',
  },

  {
    name: 'Wiesław Krawczyk',
    firstName: 'Wiesław',
    lastName: 'Krawczyk',
    login: 'wieslaw_krawczyk',
    password: '415)Kd',
  },
  {
    name: 'Witek Naumczyk',
    firstName: 'Witek',
    lastName: 'Naumczyk',
    login: 'witold_naumczyk',
    password: 'Hy59^2',
  },
  {
    name: 'Krzysztof Ząbkowice Śląskie',
    firstName: 'Krzysztof',
    lastName: 'Ząbkowice Śląskie',
    login: 'krzysztof_gramse',
    password: ';0u5E9',
  },
  {
    name: 'Tadeusz Kłodzko',
    firstName: 'Tadeusz',
    lastName: 'Kłodzko',
    login: 'tadeusz_finokiet',
    password: '9K@5m6',
  },
  {
    name: 'Karolina Gdańsk',
    firstName: 'Karolina',
    lastName: 'Gdańsk',
    login: 'karolina_szczepanska',
    password: '415?Kd',
  },
  {
    name: 'Michał Opole',
    firstName: 'Michał',
    lastName: 'Mogielnicki',
    login: 'michal_mogielnicki',
    password: 'lA577+',
  },

  {
    name: 'Jakub Stokowski Poznań',
    firstName: 'Jakub',
    lastName: 'Stokowski',
    login: 'jakub_stokowski',
    password: 'R8-3x6',
  },
  {
    name: 'Michał Warszawa',
    firstName: 'Michał',
    lastName: 'Kreft ',
    login: 'michal_kreft',
    password: 'e5Y=42',
  },
  {
    name: 'Bartłomiej Błoński',
    firstName: 'Bartłomiej',
    lastName: 'Błoński',
    login: 'bartlomiej_blonski',
    password: 'Ch)826',
  },
  {
    name: 'Łukasz Antczak Turek',
    firstName: 'Łukasz',
    lastName: 'Antczak',
    login: 'lukasz_antczak',
    password: 'P+r015',
  },
  {
    name: 'Andrzej Rola',
    firstName: 'Andrzej',
    lastName: 'Rola',
    login: 'andrzej_rola',
    password: '<2qA02',
  },

  {
    name: 'Mateusz Malicki - Poznań',
    firstName: 'Mateusz',
    lastName: 'Malicki',
    login: 'mateusz_malicki',
    password: '7=n6X0',
  },
  {
    name: 'Piotr Warszawa',
    firstName: 'Piotr',
    lastName: 'Kurzyna',
    login: 'piotr_kurzyna',
    password: '8h9Y)4',
  },
  {
    name: 'Tomasz Szmelter',
    firstName: 'Tomasz',
    lastName: 'Szmelter',
    login: 'tomasz_szmelter',
    password: 'k@Y225',
  },
  {
    name: 'Kamil Pawlik Siedlce',
    firstName: 'Kamil',
    lastName: 'Pawlik',
    login: 'kamil_pawlik',
    password: 'e87D8(',
  },
  {
    name: 'Damian Bondaruk Kalisz',
    firstName: 'Damian',
    lastName: 'Bondaruk',
    login: 'damian_bondaruk',
    password: '4L.24j',
  },
  {
    name: 'Marek Mikołajczyk Zabrze',
    firstName: 'Marek',
    lastName: 'Mikołajczyk',
    login: 'marek_mikolajczyk',
    password: 'r0(77F',
  },
  {
    name: 'Arek Warszawa',
    firstName: 'Arek',
    lastName: 'Goźliński',
    login: 'arkadiusz_gozlinski',
    password: 'r}9G14',
  },
  {
    name: 'Julia Team Wrocław',
    firstName: 'Julia Team',
    lastName: 'Bondaruk',
    login: 'julia_team',
    password: '909@Qk',
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
      update: {
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
