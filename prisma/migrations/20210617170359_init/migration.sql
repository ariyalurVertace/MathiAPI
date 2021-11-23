/*
  Warnings:

  - Added the required column `CenterType` to the `PersonCenterTypeStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PersonCenterTypeStatus" ADD COLUMN     "CenterType" "CenterType" NOT NULL;
