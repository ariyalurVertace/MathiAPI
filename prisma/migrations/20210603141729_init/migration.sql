/*
  Warnings:

  - You are about to drop the `_RoleAccessToz_Role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `RoleId` to the `RoleAccess` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoleAccessToz_Role" DROP CONSTRAINT "_RoleAccessToz_Role_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleAccessToz_Role" DROP CONSTRAINT "_RoleAccessToz_Role_B_fkey";

-- AlterTable
ALTER TABLE "RoleAccess" ADD COLUMN     "RoleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_RoleAccessToz_Role";

-- AddForeignKey
ALTER TABLE "RoleAccess" ADD FOREIGN KEY ("RoleId") REFERENCES "z_Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
