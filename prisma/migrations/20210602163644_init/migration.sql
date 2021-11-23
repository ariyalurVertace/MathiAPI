/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `mobile` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Method" AS ENUM ('POST', 'GET', 'PUT', 'PATCH', 'DELETE');

-- CreateEnum
CREATE TYPE "ParameterLocation" AS ENUM ('Url', 'Body', 'Header');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "User.email_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
DROP COLUMN "mobile",
DROP COLUMN "name",
ADD COLUMN     "IsActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "IsPasswordChanged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "LastLoggedDateTime" TIMESTAMP(3),
ADD COLUMN     "Password" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "PasswordValidFrom" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "Salt" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "UserProfileId" INTEGER,
ADD COLUMN     "Username" TEXT NOT NULL DEFAULT E'';

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Seed" (
    "id" SERIAL NOT NULL,
    "PublicKey" TEXT NOT NULL,
    "ExpiresOn" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerLog" (
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
CREATE TABLE "APIModule" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Route" TEXT NOT NULL,
    "Method" "Method" NOT NULL,
    "roleAccessId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "APIModuleParameter" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Location" "ParameterLocation" NOT NULL,
    "APIModuleId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UIModule" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "roleAccessId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UIModuleComponent" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "UIModuleId" INTEGER,
    "roleAccessId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLoginLog" (
    "id" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "Result" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
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
CREATE TABLE "AuditLogField" (
    "id" SERIAL NOT NULL,
    "Field" TEXT NOT NULL,
    "Value" TEXT NOT NULL,
    "auditLogId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAccess" (
    "id" SERIAL NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccess" (
    "id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Mobile" TEXT,
    "Email" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToRoleAccess" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Role.Name_unique" ON "Role"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "User.Username_unique" ON "User"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToRoleAccess_AB_unique" ON "_RoleToRoleAccess"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToRoleAccess_B_index" ON "_RoleToRoleAccess"("B");

-- AddForeignKey
ALTER TABLE "APIModule" ADD FOREIGN KEY ("roleAccessId") REFERENCES "RoleAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APIModuleParameter" ADD FOREIGN KEY ("APIModuleId") REFERENCES "APIModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UIModule" ADD FOREIGN KEY ("roleAccessId") REFERENCES "RoleAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UIModuleComponent" ADD FOREIGN KEY ("UIModuleId") REFERENCES "UIModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UIModuleComponent" ADD FOREIGN KEY ("roleAccessId") REFERENCES "RoleAccess"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("UserProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogField" ADD FOREIGN KEY ("auditLogId") REFERENCES "AuditLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccess" ADD FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToRoleAccess" ADD FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToRoleAccess" ADD FOREIGN KEY ("B") REFERENCES "RoleAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;
