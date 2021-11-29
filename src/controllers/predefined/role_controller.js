import {genericResponse} from "./base_controller.js";
import {
    genericCreate,
    genericGetAll,
    genericGetOne,
    genericUpdate,
    genericDelete,
    genericGetCount,
} from "./generic_controller.js";
import {statusCodes} from "../../config/constants.js";

const Table = "Role";

export async function create(req, res, next) {
    try {
        const json = req.body;
        const item = await genericCreate({Table, json, req, res, next});
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
        const item = await genericUpdate({
            Table,
            condition: {id: parseInt(req.params.id, 10)},
            json: newJson,
            req,
            res,
            next,
        });
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
            condition: {id: parseInt(req.params.id, 10), isDeleted: false},
            softDelete: true,
            req,
            res,
            next,
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

export async function getByName(name) {
    let item = await genericGetOne({
        Table,
        condition: {Name: name, isDeleted: false},
    });
    return item;
}

export async function getOne(req, res, next) {
    try {
        let selectFields = null;
        let includeFields = null;
        let sortConditions = null;

        let item = await genericGetOne({
            Table,
            condition: {id: parseInt(req.params.id, 10)},
            selectFields,
            includeFields,
            sortConditions,
            next,
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
        let condition = {isDeleted: false};
        let selectFields = null;
        let includeFields = null;
        let sortConditions = null;

        const getResult = await genericGetAll({
            Table,
            condition,
            selectFields,
            includeFields,
            sortConditions,
            next,
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
        let condition = {isDeleted: false};

        let count = await genericGetCount({
            Table,
            condition,
            next,
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
