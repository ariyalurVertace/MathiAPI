-- AlterTable
ALTER TABLE "z_User" ADD COLUMN     "ForcePasswordChange" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE INDEX "apimodule_role_apimoduleroleaccess_index" ON "z_APIModuleRoleAccess"("APIModuleId", "RoleId");

-- CreateIndex
CREATE INDEX "uimodule_role_apimoduleroleaccess_index" ON "z_UIModuleRoleAccess"("UIModuleId", "RoleId");

-- CreateIndex
CREATE INDEX "uimodulecomponent_role_uimodulecomponentroleaccess_index" ON "z_UIModuleComponentRoleAccess"("UIModuleComponentId", "RoleId");

-- CreateIndex
CREATE INDEX "userloginlog_username_index" ON "z_UserLoginLog"("Username");

-- CreateIndex
CREATE INDEX "userloginlog_username_result_index" ON "z_UserLoginLog"("Username", "Result");

-- CreateIndex
CREATE INDEX "cron_name_index" ON "z_CronSchedule"("Name");

-- AlterIndex
ALTER INDEX "role_index" RENAME TO "role_uimodulecomponentroleaccess_index";
