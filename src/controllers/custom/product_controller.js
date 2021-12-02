import {genericResponse} from "../predefined/base_controller.js";
import {
    genericCreate,
    genericGetAll,
    genericGetOne,
    genericUpdate,
    genericDelete,
    genericGetCount,
} from "../predefined/generic_controller.js";
import {statusCodes} from "../../config/constants.js";

const Table = "product";

export async function create(req, res, next) {
    try {
        const json = req.body;
        const item = await genericCreate({Table, json, req, res});
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
            condition: {id: parseInt(req.params.id, 10), isDeleted: false},
            json: newJson,
            req,
            res,
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
        let selectFields = {
            id: true,
            name: true,
            image: true,
            price: true,
            description: true,
            stock: true,
            categoryId: true,
            category: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    name: true,
                    parentCategoryId: true,
                },
            },
            sellerId: true,
            seller: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    userId: true,
                    user: {
                        where: {
                            isDeleted: false,
                        },
                        select: {
                            id: true,
                            name: true,
                            password: true,
                            forcePasswordChange: true,
                            passwordValidFrom: true,
                            isActive: true,
                            lastLoginDateTime: true,
                        },
                    },
                    addressId: true,

                    address: {
                        where: {
                            isDeleted: false,
                        },

                        select: {
                            id: true,
                            name: true,
                            addressLine1: true,
                            addressLine2: true,
                            districtId: true,

                            district: {
                                where: {
                                    isDeleted: false,
                                },
                                select: {
                                    id: true,
                                    name: true,
                                    stateId: true,

                                    state: {
                                        where: {
                                            isDeleted: false,
                                        },
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                            postalCode: true,
                            landMark: true,
                        },
                    },
                },
            },
        };
        let includeFields = null;
        let sortConditions = null;

        let item = await genericGetOne({
            Table,
            condition: {id: parseInt(req.params.id, 10), isDeleted: false},
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
        let condition = {isDeleted: false};
        let selectFields = {
            id: true,
            name: true,
            categoryId: true,
            category: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    name: true,
                    parentCategoryId: true,
                },
            },
            sellerId: true,
            seller: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    userId: true,
                    user: {
                        where: {
                            isDeleted: false,
                        },
                        select: {
                            id: true,
                            name: true,
                            password: true,
                            forcePasswordChange: true,
                            passwordValidFrom: true,
                            isActive: true,
                            lastLoginDateTime: true,
                        },
                    },
                    addressId: true,

                    address: {
                        where: {
                            isDeleted: false,
                        },
                        select: {
                            id: true,
                            name: true,
                            addressLine1: true,
                            addressLine2: true,
                            districtId: true,

                            district: {
                                where: {
                                    isDeleted: false,
                                },
                                select: {
                                    id: true,
                                    name: true,
                                    stateId: true,

                                    state: {
                                        where: {
                                            isDeleted: false,
                                        },
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                            postalCode: true,
                            landMark: true,
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

export async function getCount(req, res, next) {
    try {
        const json = req.body;
        let condition = {isDeleted: false};

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
