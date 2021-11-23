/*
  Warnings:

  - You are about to drop the column `CreatedDateTime` on the `z_ServerLog` table. All the data in the column will be lost.
  - Added the required column `RequestedDateTime` to the `z_ServerLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "z_ServerLog" DROP COLUMN "CreatedDateTime",
ADD COLUMN     "RequestedDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "RespondedDateTime" TIMESTAMP(3),
ALTER COLUMN "IsError" DROP NOT NULL,
ALTER COLUMN "IsError" DROP DEFAULT;
