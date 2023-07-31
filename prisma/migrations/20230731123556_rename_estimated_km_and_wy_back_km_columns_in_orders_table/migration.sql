/*
  Warnings:

  - You are about to drop the column `estimatedKm` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `wayBackKm` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders"
    RENAME COLUMN "estimatedKm" TO "estimatedDistance";
ALTER TABLE "orders"
    RENAME COLUMN "wayBackKm" TO "wayBackDistance";
