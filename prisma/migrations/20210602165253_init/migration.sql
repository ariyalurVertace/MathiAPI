/*
  Warnings:

  - You are about to drop the `APIModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `APIModuleParameter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLogField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServerLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UIModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UIModuleComponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLoginLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToRoleAccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "APIModule" DROP CONSTRAINT "APIModule_roleAccessId_fkey";

-- DropForeignKey
ALTER TABLE "APIModuleParameter" DROP CONSTRAINT "APIModuleParameter_APIModuleId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLogField" DROP CONSTRAINT "AuditLogField_auditLogId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- DropForeignKey
ALTER TABLE "UIModule" DROP CONSTRAINT "UIModule_roleAccessId_fkey";

-- DropForeignKey
ALTER TABLE "UIModuleComponent" DROP CONSTRAINT "UIModuleComponent_UIModuleId_fkey";

-- DropForeignKey
ALTER TABLE "UIModuleComponent" DROP CONSTRAINT "UIModuleComponent_roleAccessId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_UserProfileId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_UserId_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToRoleAccess" DROP CONSTRAINT "_RoleToRoleAccess_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToRoleAccess" DROP CONSTRAINT "_RoleToRoleAccess_B_fkey";

-- DropTable
DROP TABLE "APIModule";

-- DropTable
DROP TABLE "APIModuleParameter";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "AuditLogField";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "Seed";

-- DropTable
DROP TABLE "ServerLog";

-- DropTable
DROP TABLE "UIModule";

-- DropTable
DROP TABLE "UIModuleComponent";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserLoginLog";

-- DropTable
DROP TABLE "_RoleToRoleAccess";

-- CreateTable
CREATE TABLE "z_Seed" (
    "id" SERIAL NOT NULL,
    "PublicKey" TEXT NOT NULL,
    "ExpiresOn" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_ServerLog" (
    "id" SERIAL NOT NULL,
    "Headers" TEXT NOT NULL,
    "RequestBody" TEXT NOT NULL,
    "ResponseBody" TEXT,
    "ErrorBody" TEXT,
    "Method" "Method" NOT NULL,
    "Url" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "ResponseTime" TIMESTAMP(3),
    "CreatedDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_APIModule" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Route" TEXT NOT NULL,
    "Method" "Method" NOT NULL,
    "roleAccessId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_APIModuleParameter" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Location" "ParameterLocation" NOT NULL,
    "APIModuleId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_UIModule" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "roleAccessId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_UIModuleComponent" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "UIModuleId" INTEGER,
    "roleAccessId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_Role" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_User" (
    "id" SERIAL NOT NULL,
    "Username" TEXT NOT NULL DEFAULT E'',
    "Password" TEXT NOT NULL DEFAULT E'',
    "PasswordValidFrom" TEXT NOT NULL DEFAULT E'',
    "Salt" TEXT NOT NULL DEFAULT E'',
    "IsPasswordChanged" BOOLEAN NOT NULL DEFAULT false,
    "UserProfileId" INTEGER,
    "LastLoggedDateTime" TIMESTAMP(3),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_UserLoginLog" (
    "id" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "Result" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_AuditLog" (
    "id" SERIAL NOT NULL,
    "TableName" TEXT NOT NULL,
    "ItemId" INTEGER NOT NULL,
    "Version" INTEGER NOT NULL,
    "Address" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_AuditLogField" (
    "id" SERIAL NOT NULL,
    "Field" TEXT NOT NULL,
    "Value" TEXT NOT NULL,
    "auditLogId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleAccessToz_Role" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "z_Role.Name_unique" ON "z_Role"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "z_User.Username_unique" ON "z_User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleAccessToz_Role_AB_unique" ON "_RoleAccessToz_Role"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleAccessToz_Role_B_index" ON "_RoleAccessToz_Role"("B");

-- AddForeignKey
ALTER TABLE "z_APIModule" ADD FOREIGN KEY ("roleAccessId") REFERENCES "RoleAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_APIModuleParameter" ADD FOREIGN KEY ("APIModuleId") REFERENCES "z_APIModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UIModule" ADD FOREIGN KEY ("roleAccessId") REFERENCES "RoleAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UIModuleComponent" ADD FOREIGN KEY ("UIModuleId") REFERENCES "z_UIModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_UIModuleComponent" ADD FOREIGN KEY ("roleAccessId") REFERENCES "RoleAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_Role" ADD FOREIGN KEY ("userId") REFERENCES "z_User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_User" ADD FOREIGN KEY ("UserProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "z_AuditLogField" ADD FOREIGN KEY ("auditLogId") REFERENCES "z_AuditLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccess" ADD FOREIGN KEY ("UserId") REFERENCES "z_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_Role" ADD FOREIGN KEY ("A") REFERENCES "RoleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleAccessToz_Role" ADD FOREIGN KEY ("B") REFERENCES "z_Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
