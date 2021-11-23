/*
  Warnings:

  - The values [TiageCenter] on the enum `CenterType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CenterType_new" AS ENUM ('Hospital', 'TriageCenter', 'Lab');
ALTER TABLE "CenterTypeSection" ALTER COLUMN "CenterType" TYPE "CenterType_new" USING ("CenterType"::text::"CenterType_new");
ALTER TABLE "Center" ALTER COLUMN "CenterType" TYPE "CenterType_new" USING ("CenterType"::text::"CenterType_new");
ALTER TYPE "CenterType" RENAME TO "CenterType_old";
ALTER TYPE "CenterType_new" RENAME TO "CenterType";
DROP TYPE "CenterType_old";
COMMIT;
