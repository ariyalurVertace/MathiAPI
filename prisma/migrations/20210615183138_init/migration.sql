/*
  Warnings:

  - You are about to drop the `CenterSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CenterSection" DROP CONSTRAINT "CenterSection_SectionId_fkey";

-- DropTable
DROP TABLE "CenterSection";

-- CreateTable
CREATE TABLE "CenterTypeSection" (
    "id" SERIAL NOT NULL,
    "Label" TEXT NOT NULL,
    "CenterType" "CenterType" NOT NULL,
    "SectionId" INTEGER NOT NULL,
    "SortOrder" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "centertypesection_main_index" ON "CenterTypeSection"("CenterType");

-- AddForeignKey
ALTER TABLE "CenterTypeSection" ADD FOREIGN KEY ("SectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
