/*
  Warnings:

  - Made the column `clientId` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientName` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_clientId_clientName_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "clientId" SET NOT NULL,
ALTER COLUMN "clientName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_clientName_fkey" FOREIGN KEY ("clientId", "clientName") REFERENCES "clients"("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
