/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('Text', 'Number', 'Boolean', 'Select', 'Date', 'DateTime');

-- CreateEnum
CREATE TYPE "CenterType" AS ENUM ('Hospital', 'TiageCenter', 'Lab');

-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "Entity" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "ParentEntityId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityOption" (
    "id" SERIAL NOT NULL,
    "Value" TEXT NOT NULL,
    "SortOrder" INTEGER NOT NULL,
    "EntityId" INTEGER NOT NULL,
    "ParentEntityOptionId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Label" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionField" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "SortOrder" INTEGER NOT NULL,
    "FieldType" "FieldType" NOT NULL,
    "IsMandatory" BOOLEAN NOT NULL DEFAULT false,
    "SectionId" INTEGER NOT NULL,
    "EntityId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CenterSection" (
    "id" SERIAL NOT NULL,
    "CenterType" "CenterType" NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SortOrder" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonSection" (
    "id" SERIAL NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SortOrder" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackSection" (
    "id" SERIAL NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SortOrder" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Center" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "CenterType" "CenterType" NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CenterSectionFieldValue" (
    "id" SERIAL NOT NULL,
    "CenterId" INTEGER NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SectionFieldId" INTEGER NOT NULL,
    "Value" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Mobile" TEXT NOT NULL,
    "DOB" TIMESTAMP(3),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonSectionFieldValue" (
    "id" SERIAL NOT NULL,
    "PersonId" INTEGER NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SectionFieldId" INTEGER NOT NULL,
    "Value" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entity.Name_unique" ON "Entity"("Name");

-- CreateIndex
CREATE INDEX "entityoption_main_index" ON "EntityOption"("EntityId", "ParentEntityOptionId", "SortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Section.Name_unique" ON "Section"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "SectionField.SortOrder_SectionId_unique" ON "SectionField"("SortOrder", "SectionId");

-- CreateIndex
CREATE INDEX "sectionfield_main_index" ON "SectionField"("SectionId");

-- CreateIndex
CREATE INDEX "centersection_main_index" ON "CenterSection"("CenterType");

-- CreateIndex
CREATE UNIQUE INDEX "Center.Name_unique" ON "Center"("Name");

-- CreateIndex
CREATE INDEX "center_main_index" ON "Center"("CenterType", "IsActive", "isDeleted");

-- CreateIndex
CREATE INDEX "center_name_index" ON "Center"("Name", "IsActive", "isDeleted");

-- CreateIndex
CREATE INDEX "centersectionfieldvalue_main_index" ON "CenterSectionFieldValue"("CenterId");

-- CreateIndex
CREATE UNIQUE INDEX "Person.Mobile_unique" ON "Person"("Mobile");

-- CreateIndex
CREATE INDEX "person_mobile_index" ON "Person"("Mobile", "IsActive", "isDeleted");

-- CreateIndex
CREATE INDEX "person_name_index" ON "Person"("Name", "IsActive", "isDeleted");

-- CreateIndex
CREATE INDEX "personsectionfieldvalue_main_index" ON "PersonSectionFieldValue"("PersonId");

-- AddForeignKey
ALTER TABLE "Entity" ADD FOREIGN KEY ("ParentEntityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityOption" ADD FOREIGN KEY ("EntityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityOption" ADD FOREIGN KEY ("ParentEntityOptionId") REFERENCES "EntityOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionField" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionField" ADD FOREIGN KEY ("EntityId") REFERENCES "Entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CenterSection" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonSection" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackSection" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CenterSectionFieldValue" ADD FOREIGN KEY ("CenterId") REFERENCES "Center"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CenterSectionFieldValue" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CenterSectionFieldValue" ADD FOREIGN KEY ("SectionFieldId") REFERENCES "SectionField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonSectionFieldValue" ADD FOREIGN KEY ("PersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonSectionFieldValue" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonSectionFieldValue" ADD FOREIGN KEY ("SectionFieldId") REFERENCES "SectionField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
