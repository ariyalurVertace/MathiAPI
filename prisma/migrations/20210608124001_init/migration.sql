/*
  Warnings:

  - Made the column `ForcePasswordChange` on table `z_User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "z_User" ALTER COLUMN "ForcePasswordChange" SET NOT NULL;
