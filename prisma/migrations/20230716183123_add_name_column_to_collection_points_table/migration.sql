/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `collection_points` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `collection_points` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collection_points" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "collection_points_name_key" ON "collection_points"("name");
