/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `EntityOption` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `SectionField` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sectionfield_main_index";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "EntityOption" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "SectionField" DROP COLUMN "isDeleted";

-- CreateIndex
CREATE INDEX "sectionfield_main_index" ON "SectionField"("SectionId");
