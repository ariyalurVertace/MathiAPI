-- CreateIndex
CREATE INDEX "main_apimodule_index" ON "z_APIModule"("id", "isDeleted");

-- CreateIndex
CREATE INDEX "main_apimoduleparameter_index" ON "z_APIModuleParameter"("APIModuleId", "isDeleted");

-- CreateIndex
CREATE INDEX "main_uimodule_index" ON "z_UIModule"("id", "isDeleted");

-- CreateIndex
CREATE INDEX "main_uimodulecomponent_index" ON "z_UIModuleComponent"("UIModuleId", "isDeleted");

-- CreateIndex
CREATE INDEX "main_role_index" ON "z_Role"("id", "isDeleted");

-- CreateIndex
CREATE INDEX "main_user_index" ON "z_User"("Username", "IsActive", "isDeleted");

-- CreateIndex
CREATE INDEX "user_index" ON "z_UserRole"("UserId");

-- CreateIndex
CREATE INDEX "role_apimoduleroleaccess_index" ON "z_APIModuleRoleAccess"("RoleId");

-- CreateIndex
CREATE INDEX "role_uimoduleroleaccess_index" ON "z_UIModuleRoleAccess"("RoleId");

-- CreateIndex
CREATE INDEX "role_index" ON "z_UIModuleComponentRoleAccess"("RoleId");

-- CreateIndex
CREATE INDEX "auditlog_table_item_index" ON "z_AuditLog"("TableName", "ItemId");

-- CreateIndex
CREATE INDEX "auditlog_table_item_commited_index" ON "z_AuditLog"("TableName", "ItemId", "IsCommitted");

-- CreateIndex
CREATE INDEX "commited_index" ON "z_AuditLog"("id", "IsCommitted");

-- CreateIndex
CREATE INDEX "datetime_index" ON "z_AuditLog"("DateTime");

-- CreateIndex
CREATE INDEX "auditlog_index" ON "z_AuditLogField"("AuditLogId");
