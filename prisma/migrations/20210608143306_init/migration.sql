-- CreateTable
CREATE TABLE "z_SmsLog" (
    "id" SERIAL NOT NULL,
    "Type" TEXT NOT NULL,
    "Provider" TEXT NOT NULL,
    "To" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "Response" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_EmailLog" (
    "id" SERIAL NOT NULL,
    "Type" TEXT NOT NULL,
    "Provider" TEXT NOT NULL,
    "To" TEXT NOT NULL,
    "From" TEXT NOT NULL,
    "Subject" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "Response" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "z_FcmLog" (
    "id" SERIAL NOT NULL,
    "Type" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    "FcmToken" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "Response" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "smslog_to_type_index" ON "z_SmsLog"("To", "Type");

-- CreateIndex
CREATE INDEX "smslog_to_type_datetime_index" ON "z_SmsLog"("To", "Type", "DateTime");

-- CreateIndex
CREATE INDEX "smslog_status_index" ON "z_SmsLog"("Status");

-- CreateIndex
CREATE INDEX "emaillog_to_type_index" ON "z_EmailLog"("To", "Type");

-- CreateIndex
CREATE INDEX "emaillog_to_type_datetime_index" ON "z_EmailLog"("To", "Type", "DateTime");

-- CreateIndex
CREATE INDEX "emaillog_status_index" ON "z_EmailLog"("Status");

-- CreateIndex
CREATE INDEX "fcmlog_userid_type_index" ON "z_FcmLog"("UserId", "Type");

-- CreateIndex
CREATE INDEX "fcmlog_userid_type_datetime_index" ON "z_FcmLog"("UserId", "Type", "DateTime");

-- CreateIndex
CREATE INDEX "fcmlog_status_index" ON "z_FcmLog"("Status");

-- AddForeignKey
ALTER TABLE "z_FcmLog" ADD FOREIGN KEY ("UserId") REFERENCES "z_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
