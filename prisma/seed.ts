import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.premission.createMany({
    data: [
      {
        name: "user.create",
      },

      {
        name: "user.update",
      },
      {
        name: "user.delete",
      },
      {
        name: "user.view_one",
      },
      {
        name: "user.view_many",
      },
    ]
  });

  await prisma.role.createMany({
    data: [
      {
        name: "admin",
      },
      {
        name: "user",
      },
    ]
  });

  const allPermissions = await prisma.premission.findMany();

  await prisma.role.update({
    where: { name: "admin" },
    data: {
      premissions: {
        connect: allPermissions.map(permission => ({ id: permission.id })),
      },
    },
  });

  await prisma.role.update({
    where: { name: "user" },
    data: {
      premissions: {
        connect: [
          { name: "user.update" },
          { name: "user.view_one" },
        ],
      },
    },
  });

}

main()
  .catch((e) => console.log)
  .finally(() => prisma.$disconnect());