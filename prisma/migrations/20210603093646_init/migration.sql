/*
  Warnings:

  - Made the column `IsError` on table `z_ServerLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "z_ServerLog" ALTER COLUMN "IsError" SET NOT NULL,
ALTER COLUMN "IsError" SET DEFAULT false;
