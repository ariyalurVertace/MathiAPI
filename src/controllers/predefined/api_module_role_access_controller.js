import {genericResponse} from "./base_controller.js";
import {
    genericCreateMany,
    genericGetOne,
    genericGetAll,
    genericDelete,
} from "./generic_controller.js";
import {statusCodes} from "../../config/constants.js";

const Table = "APIModuleRoleAccess";

export async function grantAccess(req, res, next) {
    try {
        //Check Role
        let role = await genericGetOne({
            Table: "Role",
            condition: {ID: req.body.RoleId, IsDeleted: false},
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
        //Clear existing permissions

        try {
            let result = await genericDelete({
                Table,
                condition: {RoleId: parseInt(req.body.RoleId, 10)},
                softDelete: false,
                req,
                res,
            });
        } catch (error) {
            return next(error);
        }

        //Grant new permissions
        const json = [];
        req.body.APIModules.forEach(apiModuleId =>
            json.push({
                RoleId: req.body.RoleId,
                APIModuleId: apiModuleId,
            }),
        );

        let item = await genericCreateMany({Table, json, req, res});
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

export async function getAccess(req, res, next) {
    try {
        const json = req.body;
        let condition = {
            RoleId: parseInt(req.params.id, 10),
        };
        let selectFields = {
            ID: true,
            APIModule: {
                select: {
                    ID: true,
                    Name: true,
                    Route: true,
                    Method: true,
                    APIModuleParameter: {
                        select: {
                            ID: true,
                            Name: true,
                            Variable: true,
                            Location: true,
                        },
                    },
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
