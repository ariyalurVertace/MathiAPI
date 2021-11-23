/*
  Warnings:

  - A unique constraint covering the columns `[CenterId,SectionFieldId]` on the table `CenterSectionFieldValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CenterSectionFieldValue.CenterId_SectionFieldId_unique" ON "CenterSectionFieldValue"("CenterId", "SectionFieldId");
