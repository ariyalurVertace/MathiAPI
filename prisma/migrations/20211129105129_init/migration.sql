/*
  Warnings:

  - You are about to drop the `Center` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CenterSectionFieldValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CenterTypeDiagnosticsSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CenterTypePersonStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CenterTypeSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonCenterTypeDiagnosticsSectionFieldValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonDiagnostics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonSectionFieldValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SectionField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VolunteerFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VolunteerFeedbackSectionFieldValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_APIModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_APIModuleParameter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_APIModuleRoleAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_AuditLogField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_CronSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_EmailLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_FcmLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_Seed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_ServerLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_SmsLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_UIModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_UIModuleComponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_UIModuleComponentRoleAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_UIModuleRoleAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_UserFcm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_UserLoginLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `z_UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CenterSectionFieldValue" DROP CONSTRAINT "CenterSectionFieldValue_CenterId_fkey";

-- DropForeignKey
ALTER TABLE "CenterSectionFieldValue" DROP CONSTRAINT "CenterSectionFieldValue_SectionFieldId_fkey";

-- DropForeignKey
ALTER TABLE "CenterSectionFieldValue" DROP CONSTRAINT "CenterSectionFieldValue_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "CenterTypeDiagnosticsSection" DROP CONSTRAINT "CenterTypeDiagnosticsSection_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "CenterTypePersonStatus" DROP CONSTRAINT "CenterTypePersonStatus_PersonStatusId_fkey";

-- DropForeignKey
ALTER TABLE "CenterTypeSection" DROP CONSTRAINT "CenterTypeSection_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_ParentEntityId_fkey";

-- DropForeignKey
ALTER TABLE "EntityOption" DROP CONSTRAINT "EntityOption_EntityId_fkey";

-- DropForeignKey
ALTER TABLE "EntityOption" DROP CONSTRAINT "EntityOption_ParentEntityOptionId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackSection" DROP CONSTRAINT "FeedbackSection_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "PersonCenterTypeDiagnosticsSectionFieldValue" DROP CONSTRAINT "PersonCenterTypeDiagnosticsSectionFiel_PersonDiagnosticsId_fkey";

-- DropForeignKey
ALTER TABLE "PersonCenterTypeDiagnosticsSectionFieldValue" DROP CONSTRAINT "PersonCenterTypeDiagnosticsSectionFieldValu_SectionFieldId_fkey";

-- DropForeignKey
ALTER TABLE "PersonCenterTypeDiagnosticsSectionFieldValue" DROP CONSTRAINT "PersonCenterTypeDiagnosticsSectionFieldValue_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "PersonDiagnostics" DROP CONSTRAINT "PersonDiagnostics_CenterId_fkey";

-- DropForeignKey
ALTER TABLE "PersonDiagnostics" DROP CONSTRAINT "PersonDiagnostics_PersonId_fkey";

-- DropForeignKey
ALTER TABLE "PersonDiagnostics" DROP CONSTRAINT "PersonDiagnostics_PersonStatusId_fkey";

-- DropForeignKey
ALTER TABLE "PersonSection" DROP CONSTRAINT "PersonSection_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "PersonSectionFieldValue" DROP CONSTRAINT "PersonSectionFieldValue_PersonId_fkey";

-- DropForeignKey
ALTER TABLE "PersonSectionFieldValue" DROP CONSTRAINT "PersonSectionFieldValue_SectionFieldId_fkey";

-- DropForeignKey
ALTER TABLE "PersonSectionFieldValue" DROP CONSTRAINT "PersonSectionFieldValue_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "RoleAccess" DROP CONSTRAINT "RoleAccess_RoleId_fkey";

-- DropForeignKey
ALTER TABLE "SectionField" DROP CONSTRAINT "SectionField_EntityId_fkey";

-- DropForeignKey
ALTER TABLE "SectionField" DROP CONSTRAINT "SectionField_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_CenterId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccess" DROP CONSTRAINT "UserAccess_UserId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_UserId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerFeedback" DROP CONSTRAINT "VolunteerFeedback_PersonId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerFeedback" DROP CONSTRAINT "VolunteerFeedback_VolunteerId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerFeedbackSectionFieldValue" DROP CONSTRAINT "VolunteerFeedbackSectionFieldValue_SectionFieldId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerFeedbackSectionFieldValue" DROP CONSTRAINT "VolunteerFeedbackSectionFieldValue_SectionId_fkey";

-- DropForeignKey
ALTER TABLE "VolunteerFeedbackSectionFieldValue" DROP CONSTRAINT "VolunteerFeedbackSectionFieldValue_VolunteerFeedbackId_fkey";

-- DropForeignKey
ALTER TABLE "z_APIModuleParameter" DROP CONSTRAINT "z_APIModuleParameter_APIModuleId_fkey";

-- DropForeignKey
ALTER TABLE "z_APIModuleRoleAccess" DROP CONSTRAINT "z_APIModuleRoleAccess_APIModuleId_fkey";

-- DropForeignKey
ALTER TABLE "z_APIModuleRoleAccess" DROP CONSTRAINT "z_APIModuleRoleAccess_RoleId_fkey";

-- DropForeignKey
ALTER TABLE "z_AuditLog" DROP CONSTRAINT "z_AuditLog_UserId_fkey";

-- DropForeignKey
ALTER TABLE "z_AuditLogField" DROP CONSTRAINT "z_AuditLogField_AuditLogId_fkey";

-- DropForeignKey
ALTER TABLE "z_FcmLog" DROP CONSTRAINT "z_FcmLog_UserId_fkey";

-- DropForeignKey
ALTER TABLE "z_UIModuleComponent" DROP CONSTRAINT "z_UIModuleComponent_UIModuleId_fkey";

-- DropForeignKey
ALTER TABLE "z_UIModuleComponentRoleAccess" DROP CONSTRAINT "z_UIModuleComponentRoleAccess_RoleId_fkey";

-- DropForeignKey
ALTER TABLE "z_UIModuleComponentRoleAccess" DROP CONSTRAINT "z_UIModuleComponentRoleAccess_UIModuleComponentId_fkey";

-- DropForeignKey
ALTER TABLE "z_UIModuleRoleAccess" DROP CONSTRAINT "z_UIModuleRoleAccess_RoleId_fkey";

-- DropForeignKey
ALTER TABLE "z_UIModuleRoleAccess" DROP CONSTRAINT "z_UIModuleRoleAccess_UIModuleId_fkey";

-- DropForeignKey
ALTER TABLE "z_UserFcm" DROP CONSTRAINT "z_UserFcm_UserId_fkey";

-- DropForeignKey
ALTER TABLE "z_UserRole" DROP CONSTRAINT "z_UserRole_RoleId_fkey";

-- DropForeignKey
ALTER TABLE "z_UserRole" DROP CONSTRAINT "z_UserRole_UserId_fkey";

-- DropTable
DROP TABLE "Center";

-- DropTable
DROP TABLE "CenterSectionFieldValue";

-- DropTable
DROP TABLE "CenterTypeDiagnosticsSection";

-- DropTable
DROP TABLE "CenterTypePersonStatus";

-- DropTable
DROP TABLE "CenterTypeSection";

-- DropTable
DROP TABLE "Entity";

-- DropTable
DROP TABLE "EntityOption";

-- DropTable
DROP TABLE "FeedbackSection";

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "PersonCenterTypeDiagnosticsSectionFieldValue";

-- DropTable
DROP TABLE "PersonDiagnostics";

-- DropTable
DROP TABLE "PersonSection";

-- DropTable
DROP TABLE "PersonSectionFieldValue";

-- DropTable
DROP TABLE "PersonStatus";

-- DropTable
DROP TABLE "RoleAccess";

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "SectionField";

-- DropTable
DROP TABLE "UserAccess";

-- DropTable
DROP TABLE "UserProfile";

-- DropTable
DROP TABLE "VolunteerFeedback";

-- DropTable
DROP TABLE "VolunteerFeedbackSectionFieldValue";

-- DropTable
DROP TABLE "z_APIModule";

-- DropTable
DROP TABLE "z_APIModuleParameter";

-- DropTable
DROP TABLE "z_APIModuleRoleAccess";

-- DropTable
DROP TABLE "z_AuditLog";

-- DropTable
DROP TABLE "z_AuditLogField";

-- DropTable
DROP TABLE "z_CronSchedule";

-- DropTable
DROP TABLE "z_EmailLog";

-- DropTable
DROP TABLE "z_FcmLog";

-- DropTable
DROP TABLE "z_Role";

-- DropTable
DROP TABLE "z_Seed";

-- DropTable
DROP TABLE "z_ServerLog";

-- DropTable
DROP TABLE "z_SmsLog";

-- DropTable
DROP TABLE "z_UIModule";

-- DropTable
DROP TABLE "z_UIModuleComponent";

-- DropTable
DROP TABLE "z_UIModuleComponentRoleAccess";

-- DropTable
DROP TABLE "z_UIModuleRoleAccess";

-- DropTable
DROP TABLE "z_User";

-- DropTable
DROP TABLE "z_UserFcm";

-- DropTable
DROP TABLE "z_UserLoginLog";

-- DropTable
DROP TABLE "z_UserRole";

-- DropEnum
DROP TYPE "CenterType";

-- DropEnum
DROP TYPE "FieldType";

-- DropEnum
DROP TYPE "Method";

-- DropEnum
DROP TYPE "ParameterLocation";

-- CreateTable
CREATE TABLE "UserPeofile" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "userName" TEXT NOT NULL,
    "password" TEXT,
    "salt" TEXT,
    "forcePasswordChange" BOOLEAN,
    "passwordValidFrom" INTEGER,
    "isActive" BOOLEAN DEFAULT true,
    "lastLoginDateTime" TIMETZ(6),
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "districtId" INTEGER NOT NULL,
    "postalCode" INTEGER,
    "landmark" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "customerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentCategoryId" INTEGER,
    "image" TEXT DEFAULT false,
    "description" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customerProfile" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "addressId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entityState" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "isDeleted" BOOLEAN DEFAULT false,
    "isDefault" BOOLEAN,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entityStateProgress" (
    "id" INTEGER NOT NULL,
    "currentStateId" INTEGER NOT NULL,
    "nextStateId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favourite" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "shippingDate" TIMESTAMPTZ(6) NOT NULL,
    "isDelivered" BOOLEAN,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "orderDate" TIMESTAMPTZ(6) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "description" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellerProfile" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    "isApproved" BOOLEAN DEFAULT false,
    "isDeleted" BOOLEAN DEFAULT false,
    "user" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userRole" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPeofile.userName_unique" ON "UserPeofile"("userName");

-- AddForeignKey
ALTER TABLE "address" ADD FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner" ADD FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD FOREIGN KEY ("customerId") REFERENCES "customerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD FOREIGN KEY ("parentCategoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customerProfile" ADD FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customerProfile" ADD FOREIGN KEY ("userId") REFERENCES "UserPeofile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district" ADD FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entityStateProgress" ADD FOREIGN KEY ("currentStateId") REFERENCES "entityState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entityStateProgress" ADD FOREIGN KEY ("nextStateId") REFERENCES "entityState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite" ADD FOREIGN KEY ("customerId") REFERENCES "customerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourite" ADD FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD FOREIGN KEY ("customerId") REFERENCES "customerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD FOREIGN KEY ("sellerId") REFERENCES "sellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellerProfile" ADD FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRole" ADD FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRole" ADD FOREIGN KEY ("userId") REFERENCES "UserPeofile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
