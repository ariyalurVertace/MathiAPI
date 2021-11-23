-- DropIndex
DROP INDEX "sectionfield_main_index";

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "EntityOption" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SectionField" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "sectionfield_main_index" ON "SectionField"("SectionId", "IsDeleted");
