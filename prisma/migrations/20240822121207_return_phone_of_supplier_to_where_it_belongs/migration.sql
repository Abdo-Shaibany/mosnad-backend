/*
  Warnings:

  - You are about to drop the column `userId` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "userId",
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '771402072';
