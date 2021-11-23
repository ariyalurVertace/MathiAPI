-- CreateTable
CREATE TABLE "z_CronSchedule" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Rule" TEXT NOT NULL,
    "Description" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "z_CronSchedule.Name_unique" ON "z_CronSchedule"("Name");
