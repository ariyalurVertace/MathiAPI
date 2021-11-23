/*
  Warnings:

  - You are about to drop the column `Label` on the `Section` table. All the data in the column will be lost.
  - Added the required column `Label` to the `CenterSection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CenterSection" ADD COLUMN     "Label" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "Label";
