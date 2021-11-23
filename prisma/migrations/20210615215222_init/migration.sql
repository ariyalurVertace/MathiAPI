/*
  Warnings:

  - You are about to drop the column `IsPasswordChanged` on the `z_User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "z_User" DROP COLUMN "IsPasswordChanged";

-- CreateIndex
CREATE INDEX "userprofile_userid_index" ON "UserProfile"("UserId");
