import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.create({
    data: {
      name: "admin"
    }
  });

  const sellerRole = await prisma.role.create({
    data: {
      name: "seller"
    }
  });

  const user = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      password: bcrypt.hashSync("password", 10),
      username: "admin",
      phone: "771402072",
      roles:{
        connect: [adminRole]
      }
    },
  });

  const bank = await prisma.bank.create({
    data: {
      text: "بنك الامل",
    },
  });

  const currency = await prisma.bank_currency.create({
    data: {
      text: "USD",
      short: "$"
    }
  });

  const location = await prisma.bank_location.create({
    data: {
      text: "الشمال",
    },
  });

  // await prisma.account.create({
  //   data: {
  //     account_name: "Admin account",
  //     account_number: "123456789",
  //     bankId: bank.id,
  //     bank_currencyId: currency.id,
  //     bank_locationId: location.id
  //   }
  // });
}

main()
  .catch((e) => console.log)
  .finally(() => prisma.$disconnect());