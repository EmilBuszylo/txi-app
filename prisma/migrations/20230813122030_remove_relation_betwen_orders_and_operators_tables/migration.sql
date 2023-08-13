/*
  Warnings:

  - You are about to drop the column `operatorId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `operatorName` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_operatorId_operatorName_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "operatorId",
DROP COLUMN "operatorName";
