/*
  Warnings:

  - Added the required column `Variable` to the `z_APIModuleParameter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "z_APIModuleParameter" ADD COLUMN     "Variable" TEXT NOT NULL;
