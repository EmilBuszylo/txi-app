/*
  Warnings:

  - A unique constraint covering the columns `[clientInvoice]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[driverInvoice]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationFrom` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationTo` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'STARTED', 'IN_PROGRESS', 'COMPLETED', 'CNCELLED');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "actualKm" INTEGER,
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "clientInvoice" TEXT,
ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "collectionPointId" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "driverId" TEXT,
ADD COLUMN     "driverInvoice" TEXT,
ADD COLUMN     "estimatedKm" INTEGER,
ADD COLUMN     "kmForDriver" INTEGER,
ADD COLUMN     "lastEditorId" TEXT,
ADD COLUMN     "locationFrom" JSONB NOT NULL,
ADD COLUMN     "locationTo" JSONB NOT NULL,
ADD COLUMN     "locationVia" JSONB,
ADD COLUMN     "status" "OrderStatus" NOT NULL,
ADD COLUMN     "withHighway" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "withPassenger" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_name_key" ON "client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "client_id_name_key" ON "client"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_clientInvoice_key" ON "orders"("clientInvoice");

-- CreateIndex
CREATE UNIQUE INDEX "orders_driverInvoice_key" ON "orders"("driverInvoice");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_clientId_clientName_fkey" FOREIGN KEY ("clientId", "clientName") REFERENCES "client"("id", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_lastEditorId_fkey" FOREIGN KEY ("lastEditorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_collectionPointId_fkey" FOREIGN KEY ("collectionPointId") REFERENCES "collection_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;
