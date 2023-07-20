/*
  Warnings:

  - Added the required column `url` to the `collection_points` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collection_points" ADD COLUMN     "url" TEXT NOT NULL;
