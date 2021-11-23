import Prisma from "@prisma/client";
import requestIp from "request-ip";

import {createAuditLog, commitAuditLog} from "./audit_log_controller.js";
import {genericResponse} from "./base_controller.js";
import {TablesWithAttachments} from "../../config/constants.js";

const {PrismaClient} = Prisma;
const prisma = new PrismaClient();

export async function genericCreate({Table, json, req, res}) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);
        let tab = prisma[Table];

        const item = await prisma[Table].create({
            data: foreignKeyReplacement(json),
        });
        let clientIp = "";
        let userID = null;
        if (req) {
            clientIp = requestIp.getClientIp(req);
        }
        if (res) {
            userID = res?.locals?.UserID;
        }
        createAuditLog({
            Table,
            itemId: item.ID,
            json,
            isNew: true,
            UserIP: clientIp,
            UserID: userID || 3,
        });
        return item;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("P2002");
            }
        }
        let er = new Error(error);
        throw er;
    }
}

export async function genericCreateMany({Table, json, req, res}) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);
        const item = await prisma[Table].createMany({
            data: json,
        });
        let clientIp = "";
        let userID = null;
        if (req) {
            clientIp = requestIp.getClientIp(req);
        }
        if (res) {
            userID = res?.locals?.UserID;
        }
        // createAuditLog({
        //     Table,
        //     itemId: item.id,
        //     json,
        //     isNew: true,
        //     UserIP: clientIp,
        //     UserID: userID || 3,
        // });
        return item;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("P2002");
            }
        }
        let er = new Error(error);
        throw er;
    }
}
export async function genericUpdate({Table, condition, json, req, res}) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);

        const items = await prisma[Table].findMany({
            where: condition,
        });
        if (!items || items.length === 0) {
            return false;
        }

        let auditLogItemIds = [];
        let clientIp = "";
        let userID = null;
        if (req) {
            clientIp = requestIp.getClientIp(req);
        }
        if (res) {
            userID = res?.locals?.UserID;
        }
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let auditLog = await createAuditLog({
                Table,
                itemId: item.id,
                json,
                isNew: false,
                UserIP: clientIp,
                UserID: userID || 3,
            });
            if (auditLog) {
                auditLogItemIds.push(auditLog.id);
            }
        }
        const updatedItems = await prisma[Table].updateMany({
            where: condition,
            data: json,
        });
        if (updatedItems) {
            for (let i = 0; i < auditLogItemIds.length; i++) {
                commitAuditLog(auditLogItemIds[i]);
            }
        }
        return true;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("P2002");
            }
        }
        throw new Error(error);
    }
}

export async function genericGetOne({
    Table,
    condition,
    selectFields,
    includeFields,
    sortConditions,
}) {
    try {
        let actualTable = Table;
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);
        const item = await prisma[Table].findFirst({
            where: condition,
            select: selectFields || undefined,
            include: includeFields || undefined,
            orderBy: sortConditions || undefined,
        });

        if (!item) {
            return null;
        }

        //TODO - Has Attachments
        if (TablesWithAttachments.includes(actualTable)) {
            const attachments = await prisma.fileAttachment.findMany({
                where: {EntityName: actualTable, EntityIDRef: item.ID},
            });
            item.FileAttachments = attachments;
        }
        return item;
    } catch (error) {
        throw new Error(error);
    }
}

export async function genericDelete({
    Table,
    condition,
    softDelete = true,
    req,
    res,
}) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);
        if (softDelete) {
            let result = await genericUpdate({
                Table,
                condition,
                json: {IsDeleted: true},
                req,
                res,
            });
            if (result) {
                return true;
            }
        } else {
            let result = await prisma[Table].deleteMany({
                where: condition,
            });
            if (result?.count > 0) {
                return true;
            }
        }
        return false;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2014") {
                throw new Error("P2014");
            }
        }
        throw new Error(error);
    }
}

export async function genericGetAll({
    Table,
    condition,
    selectFields,
    includeFields,
    distinctFields,
    sortConditions,
    pageNumber = 1,
    pageLimit = -1,
}) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);
        let skipCount = pageLimit * (pageNumber - 1);
        const totalCount = await genericGetCount({Table, condition});
        const pagination = {};
        pagination.pageNumber = pageNumber;
        pagination.pageLimit = pageLimit;
        pagination.skipCount = skipCount;
        pagination.totalCount = totalCount;

        if (pageLimit === -1) {
            pageLimit = 10000000000000;
            skipCount = 0;
        }
        const items = await prisma[Table].findMany({
            distinct: distinctFields || undefined,
            where: condition,
            orderBy: sortConditions || undefined,
            select: selectFields || undefined,
            include: includeFields || undefined,
            take: Number(pageLimit) || undefined,
            skip: Number(skipCount) || undefined,
        });

        return {items, pagination};
    } catch (error) {
        throw new Error(error);
    }
}

export async function simpleGetAll({Table, condition, selectFields}) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);

        const items = await prisma[Table].findMany({
            where: condition,
            select: selectFields || undefined,
        });

        return items;
    } catch (error) {
        throw new Error(error);
    }
}

export async function genericSaveAttachments({
    Table,
    item,
    attachments,
    req,
    res,
}) {
    try {
        attachments.forEach(attachment => {
            attachment.EntityName = Table;
            attachment.EntityIDRef = item.ID;
            attachment.UploadedByID = res.locals.UserID;
            attachment.UploadedDateTime = new Date();
            attachment.Remarks = "";
        });

        attachments = await prisma.fileAttachment.createMany({
            data: attachments,
        });
        let clientIp = "";
        let userID = null;
        if (req) {
            clientIp = requestIp.getClientIp(req);
        }
        if (res) {
            userID = res?.locals?.UserID;
        }
        // createAuditLog({
        //     Table,
        //     itemId: item.id,
        //     json,
        //     isNew: true,
        //     UserIP: clientIp,
        //     UserID: userID || 3,
        // });
        return attachments;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error("P2002");
            }
        }
        let er = new Error(error);
        throw er;
    }
}

export async function genericGetCount({Table, condition}) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);
        const totalCount = await prisma[Table].count({where: condition});
        return totalCount;
    } catch (error) {
        throw new Error(error);
    }
}

export function getNewArray(arr = []) {
    return JSON.parse(JSON.stringify(arr));
}

export function getNewObject(obj = {}) {
    return {...obj};
}

export const foreignKeyReplacement = input => {
    let output = input;
    const foreignKeys = Object.keys(input).filter(k => k.match(/ID$/));

    foreignKeys.forEach(key => {
        const modelName = key.replace(/ID$/, "");
        const value = input[key];

        delete output[key];
        if (value)
            output = Object.assign(output, {
                [modelName]: {connect: {ID: value}},
            });
    });

    return output;
};
