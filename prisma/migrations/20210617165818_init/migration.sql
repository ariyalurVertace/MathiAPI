-- CreateTable
CREATE TABLE "CenterTypeDiagnosticsSection" (
    "id" SERIAL NOT NULL,
    "Label" TEXT NOT NULL,
    "CenterType" "CenterType" NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SortOrder" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonCenterTypeStatus" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonDiagnostics" (
    "id" SERIAL NOT NULL,
    "PersonId" INTEGER NOT NULL,
    "CenterId" INTEGER NOT NULL,
    "PersonCenterTypeStatusId" INTEGER NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonCenterTypeDiagnosticsSectionFieldValue" (
    "id" SERIAL NOT NULL,
    "PersonDiagnosticsId" INTEGER NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SectionFieldId" INTEGER NOT NULL,
    "Value" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "centertypediagnosticssection_main_index" ON "CenterTypeDiagnosticsSection"("CenterType");

-- CreateIndex
CREATE INDEX "persondiagnostics_person_index" ON "PersonDiagnostics"("PersonId");

-- CreateIndex
CREATE INDEX "persondiagnostics_center_index" ON "PersonDiagnostics"("CenterId");

-- CreateIndex
CREATE INDEX "personcentertypediagnosticssectionfieldvalue_main_index" ON "PersonCenterTypeDiagnosticsSectionFieldValue"("PersonDiagnosticsId");

-- AddForeignKey
ALTER TABLE "CenterTypeDiagnosticsSection" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonDiagnostics" ADD FOREIGN KEY ("PersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonDiagnostics" ADD FOREIGN KEY ("CenterId") REFERENCES "Center"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonDiagnostics" ADD FOREIGN KEY ("PersonCenterTypeStatusId") REFERENCES "PersonCenterTypeStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCenterTypeDiagnosticsSectionFieldValue" ADD FOREIGN KEY ("PersonDiagnosticsId") REFERENCES "PersonDiagnostics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCenterTypeDiagnosticsSectionFieldValue" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonCenterTypeDiagnosticsSectionFieldValue" ADD FOREIGN KEY ("SectionFieldId") REFERENCES "SectionField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
