/*
  Warnings:

  - You are about to drop the `_RoleAccessToz_APIModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleAccessToz_UIModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleAccessToz_UIModuleComponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoleAccessToz_APIModule" DROP CONSTRAINT "_RoleAccessToz_APIModule_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleAccessToz_APIModule" DROP CONSTRAINT "_RoleAccessToz_APIModule_B_fkey";

-- DropForeignKey
ALTER TABLE "_RoleAccessToz_UIModule" DROP CONSTRAINT "_RoleAccessToz_UIModule_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleAccessToz_UIModule" DROP CONSTRAINT "_RoleAccessToz_UIModule_B_fkey";

-- DropForeignKey
ALTER TABLE "_RoleAccessToz_UIModuleComponent" DROP CONSTRAINT "_RoleAccessToz_UIModuleComponent_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleAccessToz_UIModuleComponent" DROP CONSTRAINT "_RoleAccessToz_UIModuleComponent_B_fkey";

-- DropTable
DROP TABLE "_RoleAccessToz_APIModule";

-- DropTable
DROP TABLE "_RoleAccessToz_UIModule";

-- DropTable
DROP TABLE "_RoleAccessToz_UIModuleComponent";

-- CreateTable
CREATE TABLE "z_APIModuleRoleAccess" (
    "id" SERIAL NOT NULL,
    "APIModuleId" INTEGER NOT NULL,
    "RoleId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_UIModuleRoleAccess" (
    "id" SERIAL NOT NULL,
    "UIModuleId" INTEGER NOT NULL,
    "RoleId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_UIModuleComponentRoleAccess" (
    "id" SERIAL NOT NULL,
    "UIModuleComponentId" INTEGER NOT NULL,
    "RoleId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "z_APIModuleRoleAccess" ADD FOREIGN KEY ("APIModuleId") REFERENCES "z_APIModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_APIModuleRoleAccess" ADD FOREIGN KEY ("RoleId") REFERENCES "z_Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UIModuleRoleAccess" ADD FOREIGN KEY ("UIModuleId") REFERENCES "z_UIModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UIModuleRoleAccess" ADD FOREIGN KEY ("RoleId") REFERENCES "z_Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UIModuleComponentRoleAccess" ADD FOREIGN KEY ("UIModuleComponentId") REFERENCES "z_UIModuleComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UIModuleComponentRoleAccess" ADD FOREIGN KEY ("RoleId") REFERENCES "z_Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
