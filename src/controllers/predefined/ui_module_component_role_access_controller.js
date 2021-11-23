import {genericResponse} from "./base_controller.js";
import {
    genericCreate,
    genericGetOne,
    genericGetAll,
    genericDelete,
    genericGetCount,
} from "./generic_controller.js";
import {statusCodes} from "../../config/constants.js";

const Table = "z_UIModuleComponentRoleAccess";

export async function create(req, res, next) {
    try {
        const json = req.body;
        let role = await genericGetOne({
            Table: "z_Role",
            condition: {id: json.RoleId, IsDeleted: false},
        });
        if (!role) {
            return genericResponse({
                res,
                result: "Role not found",
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_FOUND,
            });
        }
        let item = await genericGetOne({Table, condition: json});
        if (item) {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                statusCode: statusCodes.DUPLICATE,
            });
        }
        item = await genericCreate({Table, json, req, res});
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

export async function remove(req, res, next) {
    try {
        let result = await genericDelete({
            Table,
            condition: {
                id: parseInt(req.params.id, 10),
            },
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

export async function getAll(req, res, next) {
    try {
        const json = req.body;
        let condition = {
            RoleId: json.RoleId,
        };
        let selectFields = {
            id: true,
            UIModuleComponent: {
                select: {
                    id: true,
                    Name: true,
                    IsItemSpecific: true,
                },
            },
        };
        let includeFields = null;
        let sortConditions = null;

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
        let condition = {
            RoleId: json.RoleId,
        };
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
