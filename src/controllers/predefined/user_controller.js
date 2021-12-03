/* eslint-disable camelcase */
import lodash from "lodash";
import jwt from "jsonwebtoken";
import moment from "moment";
import crypto from "crypto";
import requestIp from "request-ip";
import Prisma from "@prisma/client";
import * as ENV from "../../config/environment.js";
import {genericResponse} from "./base_controller.js";
import {statusCodes, jwtExpirationTime} from "../../config/constants.js";
import {getOTP, getFutureTime} from "../../utils/utils.js";
import sendSMS from "../../utils/sms.js";

import {
    genericGetOne,
    genericCreate,
    genericUpdate,
    genericGetAll,
    genericGetCount,
} from "./generic_controller.js";
import {decryptField} from "./seed_controller.js";

const {PrismaClient} = Prisma;
const prisma = new PrismaClient();

const Table = "User";

export const getCurrentUser = async token => {
    if (!token) return {user: null};
    try {
        const result = await jwt.verify(token, ENV.secretKey);
        return result;
    } catch (err) {
        return {user: null};
    }
};

export async function userResolver(req, res, next) {
    const {token} = req.headers;
    const {originalUrl} = req;
    const {user, iat} = await getCurrentUser(token);

    if (user) {
        if (
            user.forcePasswordChange &&
            originalUrl !== "/api/user/changepassword"
        ) {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                stringResult: "Change password",
                statusCode: statusCodes.NOT_AUTHORIZED,
            });
        }

        let selectFields = {
            id: true,
            passwordValidFrom: true,
            username: true,
            userRole: {
                select: {
                    roleId: true,
                    role: {
                        select: {
                            apiModuleRoleAccess: {
                                select: {
                                    apiModule: {
                                        select: {
                                            name: true,
                                            route: true,
                                            method: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            customer: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    email: true,
                },
            },

            seller: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    email: true,
                },
            },
        };

        const item = await genericGetOne({
            Table,
            condition: {id: user.id, isActive: true, isDeleted: false},
            selectFields,
        });

        if (item && item.passwordValidFrom <= iat) {
            let hasAccess = await checkApiAccess(item, req);
            if (!hasAccess) {
                return genericResponse({
                    res,
                    result: null,
                    exception: null,
                    pagination: null,
                    stringResult: "No access",
                    statusCode: statusCodes.NOT_AUTHORIZED,
                });
            }
            res.locals.userID = item.id;
            res.locals.username = item.username;
            res.locals.roles = item.userRole.map(x => x.roleId);
            res.locals.customerId = item.customer[0]?.id;
            res.locals.sellerId = item.seller[0]?.id;
            res.locals.user = item;
            next();
            return true;
        }
        if (!item || item.passwordValidFrom > iat) {
            if (!res.locals.skipResponse)
                return genericResponse({
                    res,
                    result: null,
                    exception: null,
                    pagination: null,
                    stringResult: "Token expired",
                    statusCode: statusCodes.NOT_AUTHORIZED,
                });
        }
    }
    if (!res.locals.skipResponse)
        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: statusCodes.NOT_AUTHORIZED,
        });
}

export async function userLogin(req, res, next) {
    try {
        let selectFields = {
            id: true,
            password: true,
            passwordValidFrom: true,
            salt: true,
            username: true,
            forcePasswordChange: true,
            lastLoginDateTime: true,
        };
        let condition = {
            username: req?.body?.username?.trim().toLowerCase(),
            isActive: true,
            isDeleted: false,
        };
        const user = await genericGetOne({
            Table,
            condition,
            selectFields,
        });
        let check = false;

        if (req?.body?.password) {
            req.body.password = await decryptField(req?.body?.password);
        }

        if (user) {
            let saltBuffer = Buffer.from(user.salt, "base64");
            check =
                user.password ===
                (await hashPassword(req?.body?.password, saltBuffer));
        }
        LoginAuthenticate(req, res, check, user, next);
    } catch (err) {
        return next(err);
    }
}

//TODO too many hits. Cleanup
export async function LoginAuthenticate(req, res, check, user, next) {
    try {
        if (check) {
            let condition = {
                id: user.id,
                isActive: true,
                isDeleted: false,
            };

            const token = jwt.sign(
                {
                    user: {
                        id: user.id,
                        forcePasswordChange: user.forcePasswordChange,
                    },
                },
                ENV.secretKey,
                {
                    expiresIn:
                        jwtExpirationTime.days * jwtExpirationTime.seconds,
                },
            );

            //TODO - Populate customer and dept official
            let customer = await genericGetOne({
                Table: "customerProfile",
                condition: {userID: user.id, isDeleted: false},
            });

            let seller = await genericGetOne({
                Table: "sellerProfile",
                condition: {UserID: user.id, isDeleted: false},
            });

            let result = {
                token: null,
                userId: user.id,
                username: user.username,
                name: user.name,
                customer,
                seller,
                lastLoginDateTime: user.lastLoginDateTime,
            };
            if (token) result.token = token;
            if (seller)
                genericUpdate({
                    Table,
                    condition,
                    json: {lastLoginDateTime: new Date()},
                    next,
                });
            if (ENV.loginLog) {
                genericCreate({
                    Table: "userLoginLog",
                    json: {
                        username: user.Username,
                        result: "Success",
                        address: requestIp.getClientIp(req),
                    },
                    next,
                });
            }
            return genericResponse({
                res,
                result,
                exception: null,
                pagination: null,
                statusCode: statusCodes.SUCCESS,
            });
        }
        if (ENV.loginLog) {
            genericCreate({
                Table: "userLoginLog",
                json: {
                    username: req?.body?.username?.trim().toLowerCase(),
                    result: "Failure",
                    address: requestIp.getClientIp(req),
                },
            });
        }
        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: statusCodes.NOT_AUTHORIZED,
        });
    } catch (err) {
        return next(err);
    }
}

export async function userRegister(req, res, next) {
    try {
        let json = req.body;
        let {userProfile} = json;
        let user = {
            username: json.username.trim().toLowerCase(),
            password: json.password,
            forcePasswordChange: json.forcePasswordChange || false,
        };

        let item = await genericGetOne({
            Table,
            condition: {
                username: user.username,
            },
        });
        if (item) {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                statusCode: statusCodes.DUPLICATE,
            });
        }

        user.salt = crypto.randomBytes(16).toString("base64");
        let saltBuffer = Buffer.from(user.salt, "base64");

        user.password = await hashPassword(user.password, saltBuffer);
        user.passwordValidFrom = moment().unix();
        user.isDeleted = false;
        user.isActive = true;

        item = await genericCreate({
            Table,
            json: user,
            req,
            res,
        });
        if (json.NoResponse) {
            return item;
        }
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

export async function userUpdate(req, res, next) {
    try {
        const json = req.body;
        let newJson = {...json};
        const item = await genericUpdate({
            Table,
            condition: {id: parseInt(req.params.id, 10)},
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

export async function userChangePassword(req, res, next) {
    try {
        const json = req.body;
        if (json.password) {
            json.password = await decryptField(json.password);
        } else {
            return genericResponse({
                res,
                result: null,
                stringResult: "password not found",
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_FOUND,
            });
        }
        if (json.newPassword) {
            json.newPassword = await decryptField(json.newPassword);
        } else {
            return genericResponse({
                res,
                result: null,
                stringResult: "New pssword not found",
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_FOUND,
            });
        }

        if (json.password === json.newPassword) {
            return genericResponse({
                res,
                result: null,
                stringResult: "New password cannot be the same as old password",
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_ALLOWED,
            });
        }

        let condition = {
            id: res.locals.userID,
            isActive: true,
            isDeleted: false,
        };
        let item = await genericGetOne({
            Table,
            condition,
        });
        if (!item) {
            return false;
        }
        let saltBuffer = Buffer.from(item.salt, "base64");
        let isValidPassword =
            item.password === (await hashPassword(json.password, saltBuffer));
        if (!isValidPassword) {
            return genericResponse({
                res,
                result: null,
                stringResult: "password does not match",
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_FOUND,
            });
        }
        item.salt = crypto.randomBytes(16).toString("base64");
        saltBuffer = Buffer.from(item.salt, "base64");

        item.password = await hashPassword(json.newPassword, saltBuffer);
        item.passwordValidFrom = moment().unix();
        item.forcePasswordChange = false;

        let result = await genericUpdate({
            Table,
            condition,
            json: item,
            req,
            res,
        });
        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: result ? statusCodes.SUCCESS : statusCodes.SERVER_ERROR,
        });
    } catch (err) {
        return next(err);
    }
}

export async function userUpdatePassword(userId, password, req, res) {
    try {
        if (password) {
            password = await decryptField(password);
        }

        let condition = {
            id: userId,
            isDeleted: false,
        };
        let item = await genericGetOne({
            Table,
            condition,
        });
        if (!item) {
            return false;
        }

        item.salt = crypto.randomBytes(16).toString("base64");
        let saltBuffer = Buffer.from(item.salt, "base64");

        item.password = await hashPassword(password, saltBuffer);
        item.passwordValidFrom = moment().unix();

        let result = await genericUpdate({
            Table,
            condition,
            json: item,
            req,
            res,
        });
        return result;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getOne(req, res, next) {
    try {
        let selectFields = {
            id: true,
            username: true,
            lastLoginDateTime: true,
            userRoles: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
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
        if (json.searchString) {
            condition.userProfile = {
                Name: {
                    contains: json.searchString,
                    mode: "insensitive",
                },
            };
        }
        let selectFields = {
            id: true,
            username: true,
            lastLoginDateTime: true,
            userRole: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
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

export async function hashPassword(password, salt) {
    if (salt && password) {
        const check = crypto
            .pbkdf2Sync(password, salt, 10000, 64, "sha1")
            .toString("base64");
        return check;
    }
    return password;
}

async function checkApiAccess(user, req) {
    try {
        let {params, method, originalUrl: route} = req;
        let noParamsRoute = route;
        if (params) {
            Object.keys(params).forEach(key => {
                //  noParamsRoute = noParamsRoute.replace(params[key], `:${key}`);
                noParamsRoute = noParamsRoute.replace(params[key], "");
            });
        }

        let userAccessApiModules = lodash
            .flatten(user.userRole.map(x => x.role.apiModuleRoleAccess))
            .map(x => x.apiModule);

        const accessApi = userAccessApiModules.find(
            x => x.Route === noParamsRoute && x.Method === method,
        );

        if (!accessApi) {
            return false;
        }

        let userRoleIds = user.userRole.map(x => x.roleId);
        let condition = {
            apiModuleId: accessApi.id,
            roleId: {in: userRoleIds},
        };

        const apiModuleRoleAccess = await genericGetOne({
            Table: "apiModuleRoleAccess",
            condition,
            pageNumber: 1,
            pageLimit: -1,
        });
        if (apiModuleRoleAccess) {
            let hasDataAccess = await checkApiDataAccess(user, req, accessApi);
            return hasDataAccess;
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function checkApiDataAccess(user, req, accessApi) {
    //TODO - Set Access
    return true;
    //Dummy Correction
    // let {params, body, headers, method, originalUrl: route} = req;
    // if (accessApi.APIModuleParameter.length > 0) {
    //     return true;
    // }
    // return true;
}
