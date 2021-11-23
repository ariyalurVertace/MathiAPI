/*
  Warnings:

  - You are about to drop the column `LastLoggedDateTime` on the `z_User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "z_User" DROP COLUMN "LastLoggedDateTime",
ADD COLUMN     "LastLoginDateTime" TIMESTAMP(3);
