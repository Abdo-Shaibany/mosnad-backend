import { Prisma } from '@prisma/client';

export function handleError(err: Prisma.PrismaClientKnownRequestError) {
  return Error(err.message);
}
