-- CreateTable
CREATE TABLE "VolunteerFeedback" (
    "id" SERIAL NOT NULL,
    "PersonId" INTEGER NOT NULL,
    "VolunteerId" INTEGER NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerFeedbackSectionFieldValue" (
    "id" SERIAL NOT NULL,
    "VolunteerFeedbackId" INTEGER NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SectionFieldId" INTEGER NOT NULL,
    "Value" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "volunteerfeedback_person_index" ON "VolunteerFeedback"("PersonId");

-- CreateIndex
CREATE INDEX "volunteerfeedback_volunteer_index" ON "VolunteerFeedback"("VolunteerId");

-- CreateIndex
CREATE INDEX "volunteerfeedbacksectionfieldvalue_main_index" ON "VolunteerFeedbackSectionFieldValue"("VolunteerFeedbackId");

-- AddForeignKey
ALTER TABLE "VolunteerFeedback" ADD FOREIGN KEY ("PersonId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerFeedback" ADD FOREIGN KEY ("VolunteerId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerFeedbackSectionFieldValue" ADD FOREIGN KEY ("VolunteerFeedbackId") REFERENCES "VolunteerFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerFeedbackSectionFieldValue" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VolunteerFeedbackSectionFieldValue" ADD FOREIGN KEY ("SectionFieldId") REFERENCES "SectionField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
