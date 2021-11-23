import {genericResponse} from "./base_controller.js";
import {
    genericCreate,
    genericGetAll,
    genericGetOne,
    genericUpdate,
    genericDelete,
    genericGetCount,
    genericCreateMany,
} from "./generic_controller.js";
import {statusCodes} from "../../config/constants.js";
import {getEntityStates} from "./entity_controller.js";

const Table = "EntityState";

export async function create(req, res, next) {
    try {
        const json = req.body;
        let nextStates = json.NextStates;

        delete json.NextStates;
        const item = await genericCreate({Table, json, req, res});
        await assignNextState(nextStates, item.ID);
        return genericResponse({
            res,
            result: item || null,
            exception: null,
            pagination: null,
            statusCode: item ? statusCodes.SUCCESS : statusCodes.INVALID_DATA,
        });
    } catch (error) {
        return next(error);
    }
}

export async function update(req, res, next) {
    try {
        const json = req.body;
        let newJson = {...json};
        let nextStates = json.NextStates;
        delete newJson.NextStates;
        const item = await genericUpdate({
            Table,
            condition: {ID: parseInt(req.params.id, 10)},
            json: newJson,
            req,
            res,
        });
        let selectFields = null;
        let includeFields = null;
        let sortConditions = null;

        let result = await genericGetOne({
            Table,
            condition: {ID: parseInt(req.params.id, 10)},
            selectFields,
            includeFields,
            sortConditions,
        });
        await assignNextState(nextStates, result.ID);
        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: item ? statusCodes.SUCCESS : statusCodes.NOT_FOUND,
        });
    } catch (error) {
        return next(error);
    }
}

export async function remove(req, res, next) {
    try {
        let result = await genericDelete({
            Table,
            condition: {ID: parseInt(req.params.id, 10)},
            softDelete: false,
            req,
            res,
        });
        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: result ? statusCodes.SUCCESS : statusCodes.NOT_FOUND,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getOne(req, res, next) {
    try {
        let selectFields = null;
        let includeFields = null;
        let sortConditions = null;

        let item = await genericGetOne({
            Table,
            condition: {ID: parseInt(req.params.id, 10)},
            selectFields,
            includeFields,
            sortConditions,
        });

        return genericResponse({
            res,
            result: item,
            exception: null,
            pagination: null,
            statusCode: item ? statusCodes.SUCCESS : statusCodes.NOT_FOUND,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getAll(req, res, next) {
    try {
        const json = req.body;
        let condition = {};
        if (json.searchString)
            condition = {
                OR: [
                    {
                        Name: {contains: json.searchString},
                    },
                    {
                        Entity: {contains: json.searchString},
                    },
                ],
            };
        if (json.Entity)
            condition = {
                Entity: json.Entity,
            };
        let selectFields = {
            ID: true,
            Name: true,
            Color: true,
            Entity: true,
            IsActive: true,
            IsDefault: true,
            CurrentEntityState: {
                select: {
                    NextEntityState: {
                        select: {
                            ID: true,
                            Name: true,
                        },
                    },
                },
            },
        };
        let includeFields = null;
        let sortConditions = json.sortCondition;
        const getResult = await genericGetAll({
            Table,
            condition,
            selectFields,
            includeFields,
            sortConditions,
            pageNumber: json.pageNumber,
            pageLimit: json.pageLimit,
        });
        let {items, pagination} = getResult;

        return genericResponse({
            res,
            result: items,
            exception: null,
            pagination,
            statusCode: statusCodes.SUCCESS,
        });
    } catch (error) {
        return next(error);
    }
}

export async function getCount(req, res, next) {
    try {
        const json = req.body;
        let condition = {};

        let count = await genericGetCount({
            Table,
            condition,
        });

        return genericResponse({
            res,
            result: count,
            exception: null,
            pagination: null,
            statusCode: statusCodes.SUCCESS,
        });
    } catch (error) {
        return next(error);
    }
}

export async function assignNextState(nextStateIds, currentState) {
    // Deleting existing EntityStateProgress
    try {
        await genericDelete({
            Table: "EntityStateProgress",
            condition: {CurrentEntityStateID: currentState},
            softDelete: false,
        });

        let currentEntityState = parseInt(currentState, 10);
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
        });
    } catch (error) {
        return error;
    }
}

export async function getNextStates(req, res, next) {
    const json = req.body;
    let {items} = await getEntityStates(json.Entity);
    return genericResponse({
        res,
        result: items || null,
        exception: null,
        pagination: null,
        statusCode: items ? statusCodes.SUCCESS : statusCodes.INVALID_DATA,
    });
}
export async function getAllEntityStateProgress(req, res, next) {
    try {
        const json = req.body;
        let condition = {
            CurrentEntityState: {is: {Entity: json.Entity}},
        };
        let selectFields = {
            ID: true,
            CurrentEntityState: {
                select: {
                    ID: true,
                    Name: true,
                },
            },
            NextEntityState: {
                select: {
                    ID: true,
                    Name: true,
                },
            },
        };

        let includeFields = null;
        let sortConditions = json.sortCondition;
        const getResult = await genericGetAll({
            Table: "EntityStateProgress",
            condition,
            selectFields,
            includeFields,
            sortConditions,
            pageNumber: json.pageNumber,
            pageLimit: json.pageLimit,
        });
        let {items, pagination} = getResult;

        return genericResponse({
            res,
            result: items,
            exception: null,
            pagination,
            statusCode: statusCodes.SUCCESS,
        });
    } catch (error) {
        return next(error);
    }
}
