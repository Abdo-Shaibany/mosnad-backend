import { PrismaClient } from "@prisma/client";
export class MyPrisma {
  private static prisma?: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!MyPrisma.prisma) {
      MyPrisma.prisma = new PrismaClient();
    }
    return MyPrisma.prisma;
  }
}
