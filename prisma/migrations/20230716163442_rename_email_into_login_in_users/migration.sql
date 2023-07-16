/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

ALTER TABLE "users" RENAME COLUMN "email" TO "login";

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");
