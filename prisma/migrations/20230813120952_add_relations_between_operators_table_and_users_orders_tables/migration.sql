/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `operators` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "driver_details" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "operatorName" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "operatorName" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "operatorId" TEXT,
ADD COLUMN     "operatorName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "operators_id_name_key" ON "operators"("id", "name");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_operatorId_operatorName_fkey" FOREIGN KEY ("operatorId", "operatorName") REFERENCES "operators"("id", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_details" ADD CONSTRAINT "driver_details_operatorId_operatorName_fkey" FOREIGN KEY ("operatorId", "operatorName") REFERENCES "operators"("id", "name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_operatorId_operatorName_fkey" FOREIGN KEY ("operatorId", "operatorName") REFERENCES "operators"("id", "name") ON DELETE SET NULL ON UPDATE CASCADE;
