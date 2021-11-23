/*
  Warnings:

  - Added the required column `CenterId` to the `UserAccess` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAccess" ADD COLUMN     "CenterId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "useraccess_center_index" ON "UserAccess"("CenterId");

-- AddForeignKey
ALTER TABLE "UserAccess" ADD FOREIGN KEY ("CenterId") REFERENCES "Center"("id") ON DELETE CASCADE ON UPDATE CASCADE;
