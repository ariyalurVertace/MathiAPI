/*
  Warnings:

  - A unique constraint covering the columns `[UserProfileId]` on the table `z_User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "z_User_UserProfileId_unique" ON "z_User"("UserProfileId");
