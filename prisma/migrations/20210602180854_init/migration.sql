/*
  Warnings:

  - You are about to drop the column `UserProfileId` on the `z_User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[UserId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "z_User" DROP CONSTRAINT "z_User_UserProfileId_fkey";

-- DropIndex
DROP INDEX "z_User_UserProfileId_unique";

-- AlterTable
ALTER TABLE "z_User" DROP COLUMN "UserProfileId";

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_UserId_unique" ON "UserProfile"("UserId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD FOREIGN KEY ("UserId") REFERENCES "z_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
