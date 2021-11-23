/*
  Warnings:

  - Changed the type of `PasswordValidFrom` on the `z_User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "z_User" DROP COLUMN "PasswordValidFrom",
ADD COLUMN     "PasswordValidFrom" INTEGER NOT NULL;
