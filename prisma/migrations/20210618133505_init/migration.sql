/*
  Warnings:

  - You are about to drop the column `PersonCenterTypeStatusId` on the `PersonDiagnostics` table. All the data in the column will be lost.
  - You are about to drop the `PersonCenterTypeStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `PersonStatusId` to the `PersonDiagnostics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PersonDiagnostics" DROP CONSTRAINT "PersonDiagnostics_PersonCenterTypeStatusId_fkey";

-- AlterTable
ALTER TABLE "PersonDiagnostics" DROP COLUMN "PersonCenterTypeStatusId",
ADD COLUMN     "PersonStatusId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PersonCenterTypeStatus";

-- CreateTable
CREATE TABLE "PersonStatus" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "SortOrder" INTEGER NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CenterTypePersonStatus" (
    "id" SERIAL NOT NULL,
    "CenterType" "CenterType" NOT NULL,
    "PersonStatusId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "centertypepersonstatus_main_index" ON "CenterTypePersonStatus"("CenterType");

-- AddForeignKey
ALTER TABLE "CenterTypePersonStatus" ADD FOREIGN KEY ("PersonStatusId") REFERENCES "PersonStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonDiagnostics" ADD FOREIGN KEY ("PersonStatusId") REFERENCES "PersonStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
