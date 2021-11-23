/*
  Warnings:

  - You are about to drop the column `IsDeleted` on the `PersonStatus` table. All the data in the column will be lost.
  - You are about to drop the column `SortOrder` on the `PersonStatus` table. All the data in the column will be lost.
  - Added the required column `SortOrder` to the `CenterTypePersonStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CenterTypePersonStatus" ADD COLUMN     "SortOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PersonStatus" DROP COLUMN "IsDeleted",
DROP COLUMN "SortOrder";
