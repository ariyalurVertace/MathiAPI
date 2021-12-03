/*
  Warnings:

  - You are about to drop the column `addressId` on the `customerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `sellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `sellerProfile` table. All the data in the column will be lost.
  - You are about to drop the `UserPeofile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `sellerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "method" AS ENUM ('POST', 'GET', 'PUT', 'PATCH', 'DELETE');

-- DropForeignKey
ALTER TABLE "customerProfile" DROP CONSTRAINT "customerProfile_addressId_fkey";

-- DropForeignKey
ALTER TABLE "customerProfile" DROP CONSTRAINT "customerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "sellerProfile" DROP CONSTRAINT "sellerProfile_addressId_fkey";

-- DropForeignKey
ALTER TABLE "userRole" DROP CONSTRAINT "userRole_userId_fkey";

-- AlterTable
ALTER TABLE "address" ADD COLUMN     "customerId" INTEGER,
ADD COLUMN     "sellerId" INTEGER DEFAULT 0,
ADD COLUMN     "stateId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "customerProfile" DROP COLUMN "addressId";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "sellerProfile" DROP COLUMN "addressId",
DROP COLUMN "user",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserPeofile";

-- CreateTable
CREATE TABLE "apiModule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "method" "method",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apiModuleRoleAccess" (
    "id" SERIAL NOT NULL,
    "apiModuleId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productReview" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "rating" INTEGER,
    "isDeleted" BOOLEAN DEFAULT false,
    "productId" INTEGER,
    "customerId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productImage" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
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

-- CreateIndex
CREATE UNIQUE INDEX "apiModule.route_unique" ON "apiModule"("route");

-- CreateIndex
CREATE INDEX "fki_apiModuleId" ON "apiModuleRoleAccess"("apiModuleId");

-- CreateIndex
CREATE INDEX "fki_roleId" ON "apiModuleRoleAccess"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user.userName_unique" ON "user"("userName");

-- AddForeignKey
ALTER TABLE "apiModuleRoleAccess" ADD FOREIGN KEY ("apiModuleId") REFERENCES "apiModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apiModuleRoleAccess" ADD FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD FOREIGN KEY ("customerId") REFERENCES "customerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD FOREIGN KEY ("sellerId") REFERENCES "sellerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customerProfile" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productReview" ADD FOREIGN KEY ("customerId") REFERENCES "customerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productReview" ADD FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sellerProfile" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRole" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productImage" ADD FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
