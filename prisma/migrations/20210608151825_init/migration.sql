-- AlterTable
ALTER TABLE "z_ServerLog" ADD COLUMN     "Params" TEXT,
ADD COLUMN     "Route" TEXT;

-- CreateTable
CREATE TABLE "z_UserFcm" (
    "id" SERIAL NOT NULL,
    "UserId" INTEGER NOT NULL,
    "Token" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "userfcm_userid_index" ON "z_UserFcm"("UserId");

-- AddForeignKey
ALTER TABLE "z_UserFcm" ADD FOREIGN KEY ("UserId") REFERENCES "z_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
