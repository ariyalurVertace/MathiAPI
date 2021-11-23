/*
  Warnings:

  - You are about to drop the `_z_RoleToz_User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_z_RoleToz_User" DROP CONSTRAINT "_z_RoleToz_User_A_fkey";

-- DropForeignKey
ALTER TABLE "_z_RoleToz_User" DROP CONSTRAINT "_z_RoleToz_User_B_fkey";

-- DropTable
DROP TABLE "_z_RoleToz_User";

-- CreateTable
CREATE TABLE "z_UserRole" (
    "id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "RoleId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "z_UserRole" ADD FOREIGN KEY ("UserId") REFERENCES "z_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UserRole" ADD FOREIGN KEY ("RoleId") REFERENCES "z_Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
