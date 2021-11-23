-- AlterTable
ALTER TABLE "z_APIModule" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "z_APIModuleParameter" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "z_Role" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "z_UIModule" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "z_UIModuleComponent" ADD COLUMN     "IsDeleted" BOOLEAN NOT NULL DEFAULT false;
