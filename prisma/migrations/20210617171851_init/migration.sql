/*
  Warnings:

  - Added the required column `SortOrder` to the `PersonCenterTypeStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonCenterTypeStatus" ADD COLUMN     "SortOrder" INTEGER NOT NULL;
