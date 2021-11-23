/*
  Warnings:

  - You are about to drop the column `IsDeleted` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `IsDeleted` on the `EntityOption` table. All the data in the column will be lost.
  - You are about to drop the column `IsDeleted` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the column `IsDeleted` on the `SectionField` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sectionfield_main_index";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "IsDeleted";

-- AlterTable
ALTER TABLE "EntityOption" DROP COLUMN "IsDeleted";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "IsDeleted";

-- AlterTable
ALTER TABLE "SectionField" DROP COLUMN "IsDeleted";

-- CreateIndex
CREATE INDEX "sectionfield_main_index" ON "SectionField"("SectionId");
