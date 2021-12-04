/*
  Warnings:

  - You are about to drop the column `IsActive` on the `Person` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "person_mobile_index";

-- DropIndex
DROP INDEX "person_name_index";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "IsActive";

-- CreateIndex
CREATE INDEX "person_mobile_index" ON "Person"("Mobile", "isDeleted");

-- CreateIndex
CREATE INDEX "person_name_index" ON "Person"("Name", "isDeleted");
