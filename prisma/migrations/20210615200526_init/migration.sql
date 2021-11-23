/*
  Warnings:

  - Made the column `Value` on table `CenterSectionFieldValue` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CenterSectionFieldValue" ALTER COLUMN "Value" SET NOT NULL;
