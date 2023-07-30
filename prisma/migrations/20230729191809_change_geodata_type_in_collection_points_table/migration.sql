/*
  Warnings:

  - The `lat` column on the `collection_points` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lng` column on the `collection_points` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "collection_points" DROP COLUMN "lat",
ADD COLUMN     "lat" INTEGER,
DROP COLUMN "lng",
ADD COLUMN     "lng" INTEGER;
