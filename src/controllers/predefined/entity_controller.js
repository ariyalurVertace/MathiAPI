import Prisma from "@prisma/client";
import requestIp from "request-ip";

import {genericResponse} from "./base_controller.js";
import {statusCodes} from "../../config/constants.js";

import {
    genericCreate,
    genericUpdate,
    genericDelete,
    genericCreateMany,
} from "./generic_controller.js";

import {createAuditLog, commitAuditLog} from "./audit_log_controller.js";

const {PrismaClient} = Prisma;
const prisma = new PrismaClient();

export async function getEntityStates(Table) {
    try {
        try {
            let condition = {Entity: Table, IsActive: true};
            let selectFields = {
                NextEntityState: {
                    select: {ID: true, Name: true, Color: true},
                },
            };
            const items = await prisma.entityState.findMany({
                where: condition,
            });
            return {items};
        } catch (error) {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function assignNextState(req, res, next) {
    // Deleting existing EntityStateProgress
    try {
        let currentEntityState = parseInt(req.params.id, 10);
        await genericDelete({
            Table: "EntityStateProgress",
            condition: {CurrentEntityStateID: currentEntityState},
            softDelete: false,
            req,
            res,
        });

        let nextStateIds = req.body.NextStates;
        // for (const nextStateId of nextStateIds)
        let nextStates = nextStateIds.map(nextStateId => {
            return {
                CurrentEntityStateID: currentEntityState,
                NextEntityStateID: nextStateId,
                IsDeleted: false,
            };
        });

        let result = await genericCreateMany({
            Table: "EntityStateProgress",
            json: nextStates,
            req,
            res,
        });
        return genericResponse({
            res,
            result,
            exception: null,
            pagination: null,
            statusCode: result ? statusCodes.SUCCESS : statusCodes.NOT_FOUND,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getFinaltEntityState(Table) {
    try {
        const entityStates = await prisma.$queryRaw`Select "ID" from Public."EntityState" Where "Entity" = ${Table} And  "ID" in (SELECT DISTINCT "NextEntityStateID" 
        FROM public."EntityStateProgress" WHERE "NextEntityStateID"  NOT IN 
        ( SELECT "CurrentEntityStateID" FROM public."EntityStateProgress"))`;
        return entityStates;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getNextEntityStates(EntityStateID) {
    try {
        let condition = {CurrentEntityStateID: EntityStateID, IsDeleted: false};
        let selectFields = {
            NextEntityState: {
                select: {ID: true, Name: true, Color: true},
            },
        };
        const items = await prisma.entityStateProgress.findMany({
            where: condition,
            select: selectFields,
        });

        return {items};
    } catch (error) {
        throw new Error(error);
    }
}

export async function getDefaultEntityState(Table) {
    try {
        let condition = {Entity: Table, IsDefault: true, IsActive: true};

        const item = await prisma.entityState.findFirst({
            where: condition,
        });

        return item.ID;
    } catch (error) {
        throw new Error(error);
    }
}

export async function takeEntityAction(
    UserID,
    Table,
    EntityID,
    EntityStateID,
    req,
    res,
    next,
) {
    try {
        const check = await isActionAllowed(
            UserID,
            Table,
            EntityID,
            EntityStateID,
            next,
        );
        if (check) {
            const json = {EntityStateID}; //New state to update
            const item = await genericUpdate({
                Table,
                condition: {ID: parseInt(EntityID, 10), IsDeleted: false},
                json,
                req,
                res,
            });

            if (item) {
                // Update Success
                const clientIp = requestIp.getClientIp(req);

                let entityStateLog = {
                    EntityType: Table,
                    EntityIDRef: parseInt(EntityID, 10),
                    EntityStateID,
                    ActionByID: UserID,
                    ActionDateTime: new Date(),
                    ClientIP: clientIp,
                };
                entityStateLog = await genericCreate({
                    Table: "EntityStateLog",
                    json: entityStateLog,
                    req,
                    res,
                });
            }

            return genericResponse({
                res,
                result: item || null,
                exception: null,
                pagination: null,
                statusCode: item ? statusCodes.SUCCESS : statusCodes.NOT_FOUND,
            });
        }
        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: statusCodes.NOT_AUTHORIZED,
        });
    } catch (error) {
        return next(error);
    }
}

export async function isActionAllowed(UserID, Table, EntityID, EntityStateID) {
    try {
        Table = Table.charAt(0).toLowerCase() + Table.substring(1);
        const obj = await prisma[Table].findFirst({
            where: {ID: parseInt(EntityID, 10)},
        });
        let condition = {
            CurrentEntityStateID: obj.EntityStateID,
            NextEntityStateID: EntityStateID,
            IsDeleted: false,
        };
        const item = await prisma.entityStateProgress.findMany({
            where: condition,
            select: {ID: true},
        });

        return item.length > 0;
    } catch (error) {
        throw new Error(error);
    }
}
