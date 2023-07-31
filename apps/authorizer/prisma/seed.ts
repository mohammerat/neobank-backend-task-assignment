import { PrismaClient } from '@prisma/client';
import { fakerFA as faker } from '@faker-js/faker';
import minimist from 'minimist';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export function createUser() {
  const randomBanned = Math.random() < 0.01;
  const gender = faker.helpers.arrayElement(['Male', 'Female']);
  let phoneNumber: string | string[] = faker.phone.number('9#########');
  phoneNumber = phoneNumber.split('');
  phoneNumber[1] = String(faker.helpers.arrayElement([0, 1, 3, 9]));
  phoneNumber = phoneNumber.join('');
  const password = bcrypt.hashSync(faker.internet.password(), 10);
  return {
    name: faker.person.firstName(gender.toLowerCase() as 'male' | 'female'),
    family: faker.person.lastName(),
    mobile: phoneNumber,
    age: faker.number.int({ min: 18, max: 70 }),
    gender: gender,
    password,
    registeredAt: new Date(
      faker.date.past({
        years: 5,
      })
    ),
    deletedAt:
      Math.random() < 0.001
        ? new Date(
            faker.date.past({
              years: 3,
            })
          )
        : null,
    bannedAt: randomBanned
      ? new Date(
          faker.date.past({
            years: 1,
          })
        )
      : null,
    bannedBy: randomBanned ? faker.number.int() : null,
    bannedUntil: randomBanned
      ? new Date(
          faker.date.future({
            years: 1,
          })
        )
      : null,
  };
}

async function main() {
  const args = minimist(process.argv.slice(2));
  for (let i = 0; i < args.n ?? 1; i++) {
    const user = createUser();
    await prisma.user.create({
      data: {
        ...user,
        passwordHistories: {
          create: {
            hashedPassword: user.password,
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
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
