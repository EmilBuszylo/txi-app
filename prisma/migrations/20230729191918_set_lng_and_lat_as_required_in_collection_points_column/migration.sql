/*
  Warnings:

  - Made the column `lat` on table `collection_points` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lng` on table `collection_points` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collection_points" ALTER COLUMN "lat" SET NOT NULL,
ALTER COLUMN "lng" SET NOT NULL;
