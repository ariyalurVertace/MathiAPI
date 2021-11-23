import lodash from "lodash";
import {
    genericGetOne,
    genericCreate,
    genericUpdate,
    genericGetAll,
} from "./generic_controller.js";
import {genericResponse} from "./base_controller.js";
import {statusCodes, TablesToAudit} from "../../config/constants.js";
import * as ENV from "../../config/environment.js";

export async function createAuditLog({
    Table,
    itemId,
    json,
    isNew,
    UserID,
    UserIP,
}) {
    try {
        if (ENV.auditLog) {
            let tableToAudit = TablesToAudit.find(
                x => x.Table.toLowerCase() === Table.toLowerCase(),
            );
            if (tableToAudit) {
                let newVersion = 1;
                let previousDocument = {};
                let currentDocument = json;
                if (!isNew) {
                    let lastVersion = await await genericGetOne({
                        Table: "z_AuditLog",
                        condition: {
                            TableName: Table.toLowerCase(),
                            ItemId: itemId,
                        },
                        sortConditions: {
                            DateTime: "desc",
                        },
                    });
                    if (lastVersion) {
                        newVersion = lastVersion.Version + 1;
                    }
                    previousDocument = await genericGetOne({
                        Table,
                        condition: {id: itemId},
                    });

                    currentDocument = JSON.parse(
                        JSON.stringify(previousDocument),
                    );
                    currentDocument = lodash.assign(currentDocument, json);
                }

                let updatedValue = {};
                for (let i = 0; i < tableToAudit.Fields.length; i++) {
                    let field = tableToAudit.Fields[i];
                    let currentValue = lodash.get(currentDocument, field, "");
                    let previousValue = lodash.get(previousDocument, field, "");
                    if (
                        !previousDocument ||
                        `${previousValue}` !== `${currentValue}`
                    ) {
                        lodash.set(updatedValue, field, currentValue);
                    }
                    // else {
                    //     lodash.set(updatedValue, field, "No-Change");
                    // }
                }
                if (!lodash.isEmpty(updatedValue)) {
                    let newFields = [];
                    Object.keys(updatedValue).forEach(key => {
                        newFields.push({
                            Field: key,
                            Value: `${updatedValue[key]}`,
                        });
                    });
                    let newLog = {
                        TableName: Table.toLowerCase(),
                        ItemId: itemId,
                        Version: newVersion,
                        Address: UserIP,
                        UserId: UserID,
                        Fields: {
                            create: newFields,
                        },
                    };
                    let newAuditLog = await genericCreate({
                        Table: "z_AuditLog",
                        json: newLog,
                    });
                    if (newAuditLog && isNew) {
                        commitAuditLog(newAuditLog.id);
                    }
                    return newAuditLog;
                }
            }
        }
    } catch (err) {
        return false;
    }
}

export async function commitAuditLog(auditId) {
    if (ENV.auditLog) {
        await genericUpdate({
            Table: "z_AuditLog",
            condition: {id: auditId, IsCommitted: false},
            json: {IsCommitted: true},
        });
    }
}

export async function getAuditHistory(req, res, next) {
    try {
        let {Table, ItemId} = req.body;
        const selectFields = {
            Version: true,
            Address: true,
            DateTime: true,
            User: {
                select: {
                    Username: true,
                    UserProfile: {
                        select: {
                            Name: true,
                        },
                    },
                },
            },
            Fields: {
                select: {
                    Field: true,
                    Value: true,
                },
            },
        };
        const sortConditions = {
            Version: "desc",
        };
        let item = await genericGetAll({
            Table: "z_AuditLog",
            condition: {
                TableName: Table.toLowerCase(),
                ItemId,
                IsCommitted: true,
            },
            selectFields,
            sortConditions,
            pageNumber: 1,
            pageLimit: -1,
        });
        return genericResponse({
            res,
            result: item,
            exception: null,
            pagination: null,
            statusCode: statusCodes.SUCCESS,
        });
    } catch (err) {
        return next(err);
    }
}
