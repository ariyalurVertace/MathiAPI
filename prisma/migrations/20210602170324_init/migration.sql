/*
  Warnings:

  - You are about to drop the column `roleAccessId` on the `z_APIModule` table. All the data in the column will be lost.
  - You are about to drop the column `auditLogId` on the `z_AuditLogField` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `z_Role` table. All the data in the column will be lost.
  - You are about to drop the column `roleAccessId` on the `z_UIModule` table. All the data in the column will be lost.
  - You are about to drop the column `roleAccessId` on the `z_UIModuleComponent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "z_APIModule" DROP CONSTRAINT "z_APIModule_roleAccessId_fkey";

-- DropForeignKey
ALTER TABLE "z_AuditLogField" DROP CONSTRAINT "z_AuditLogField_auditLogId_fkey";

-- DropForeignKey
ALTER TABLE "z_Role" DROP CONSTRAINT "z_Role_userId_fkey";

-- DropForeignKey
ALTER TABLE "z_UIModule" DROP CONSTRAINT "z_UIModule_roleAccessId_fkey";

-- DropForeignKey
ALTER TABLE "z_UIModuleComponent" DROP CONSTRAINT "z_UIModuleComponent_roleAccessId_fkey";

-- AlterTable
ALTER TABLE "z_APIModule" DROP COLUMN "roleAccessId";

-- AlterTable
ALTER TABLE "z_AuditLogField" DROP COLUMN "auditLogId",
ADD COLUMN     "AuditLogId" INTEGER;

-- AlterTable
ALTER TABLE "z_Role" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "z_UIModule" DROP COLUMN "roleAccessId";

-- AlterTable
ALTER TABLE "z_UIModuleComponent" DROP COLUMN "roleAccessId";

-- CreateTable
CREATE TABLE "_RoleAccessToz_APIModule" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleAccessToz_UIModule" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleAccessToz_UIModuleComponent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_z_RoleToz_User" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoleAccessToz_APIModule_AB_unique" ON "_RoleAccessToz_APIModule"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleAccessToz_APIModule_B_index" ON "_RoleAccessToz_APIModule"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleAccessToz_UIModule_AB_unique" ON "_RoleAccessToz_UIModule"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleAccessToz_UIModule_B_index" ON "_RoleAccessToz_UIModule"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleAccessToz_UIModuleComponent_AB_unique" ON "_RoleAccessToz_UIModuleComponent"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleAccessToz_UIModuleComponent_B_index" ON "_RoleAccessToz_UIModuleComponent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_z_RoleToz_User_AB_unique" ON "_z_RoleToz_User"("A", "B");

-- CreateIndex
CREATE INDEX "_z_RoleToz_User_B_index" ON "_z_RoleToz_User"("B");

-- AddForeignKey
ALTER TABLE "z_AuditLogField" ADD FOREIGN KEY ("AuditLogId") REFERENCES "z_AuditLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_APIModule" ADD FOREIGN KEY ("A") REFERENCES "RoleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_APIModule" ADD FOREIGN KEY ("B") REFERENCES "z_APIModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_UIModule" ADD FOREIGN KEY ("A") REFERENCES "RoleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_UIModule" ADD FOREIGN KEY ("B") REFERENCES "z_UIModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_UIModuleComponent" ADD FOREIGN KEY ("A") REFERENCES "RoleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_UIModuleComponent" ADD FOREIGN KEY ("B") REFERENCES "z_UIModuleComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_z_RoleToz_User" ADD FOREIGN KEY ("A") REFERENCES "z_Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_z_RoleToz_User" ADD FOREIGN KEY ("B") REFERENCES "z_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
