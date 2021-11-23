/*
  Warnings:

  - Added the required column `Label` to the `FeedbackSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Label` to the `PersonSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeedbackSection" ADD COLUMN     "Label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PersonSection" ADD COLUMN     "Label" TEXT NOT NULL;
