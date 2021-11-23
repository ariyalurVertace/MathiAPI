-- DropIndex
DROP INDEX "datetime_index";

-- DropIndex
DROP INDEX "emaillog_to_type_index";

-- DropIndex
DROP INDEX "fcmlog_userid_type_index";

-- DropIndex
DROP INDEX "smslog_to_type_datetime_index";

-- CreateIndex
CREATE INDEX "userrole_role_index" ON "z_UserRole"("RoleId");

-- AlterIndex
ALTER INDEX "main_apimodule_index" RENAME TO "apimodule_main_index";

-- AlterIndex
ALTER INDEX "main_apimoduleparameter_index" RENAME TO "apimoduleparameter_main_index";

-- AlterIndex
ALTER INDEX "apimodule_role_apimoduleroleaccess_index" RENAME TO "apimoduleroleaccess_apimodule_role_index";

-- AlterIndex
ALTER INDEX "role_apimoduleroleaccess_index" RENAME TO "apimoduleroleaccess_role_index";

-- AlterIndex
ALTER INDEX "commited_index" RENAME TO "auditlog_commited_index";

-- AlterIndex
ALTER INDEX "auditlog_index" RENAME TO "auditlog_auditlogid_index";

-- AlterIndex
ALTER INDEX "main_role_index" RENAME TO "role_main_index";

-- AlterIndex
ALTER INDEX "smslog_to_type_index" RENAME TO "smslog_to_type_datetime_index";

-- AlterIndex
ALTER INDEX "main_uimodule_index" RENAME TO "uimodule_main_index";

-- AlterIndex
ALTER INDEX "main_uimodulecomponent_index" RENAME TO "uimodulecomponent_main_index";

-- AlterIndex
ALTER INDEX "role_uimodulecomponentroleaccess_index" RENAME TO "uimodulecomponentroleaccess_role_index";

-- AlterIndex
ALTER INDEX "uimodulecomponent_role_uimodulecomponentroleaccess_index" RENAME TO "uimodulecomponentroleaccess_uimodulecomponent_role_index";

-- AlterIndex
ALTER INDEX "role_uimoduleroleaccess_index" RENAME TO "uimoduleroleaccess_role_index";

-- AlterIndex
ALTER INDEX "uimodule_role_apimoduleroleaccess_index" RENAME TO "apimoduleroleaccess_uimodule_role_index";

-- AlterIndex
ALTER INDEX "main_user_index" RENAME TO "user_main_index";

-- AlterIndex
ALTER INDEX "user_index" RENAME TO "userrole_user_index";
