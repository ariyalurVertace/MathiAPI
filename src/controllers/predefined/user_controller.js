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
        // const result = {
        //     user: {id: 5},
        //     iat: 1632827874,
        //     ForcePasswordChange: true,
        // };
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
            user.ForcePasswordChange &&
            originalUrl !== "/api/user/changepassword"
        ) {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                stringResult: "Change Password",
                statusCode: statusCodes.NOT_AUTHORIZED,
            });
        }

        let selectFields = {
            id: true,
            PasswordValidFrom: true,
            Username: true,
            UserRole: {
                select: {
                    RoleId: true,
                    Role: {
                        select: {
                            APIModuleRoleAccess: {
                                select: {
                                    APIModule: {
                                        select: {
                                            Name: true,
                                            Route: true,
                                            Method: true,
                                            APIModuleParameter: {
                                                where: {
                                                    isDeleted: false,
                                                },
                                                select: {
                                                    Name: true,
                                                    Variable: true,
                                                    Location: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            Officer: {
                select: {
                    id: true,
                    Office: {
                        select: {id: true},
                    },
                    Designation: {
                        select: {id: true, Rank: true},
                    },
                },
            },
            WelfareDepartmentOfficial: {
                select: {
                    id: true,
                    Office: {
                        select: {id: true},
                    },
                    WelfareDepartmentDesignation: {
                        select: {id: true, Rank: true},
                    },
                    WelfareDepartmentPosting: {
                        select: {id: true},
                    },
                },
            },
        };

        const item = await genericGetOne({
            Table,
            condition: {id: user.id, IsActive: true, isDeleted: false},
            selectFields,
        });

        if (item && item.PasswordValidFrom <= iat) {
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
            res.locals.UserID = item.id;
            res.locals.Username = item.Username;
            res.locals.Roles = item.UserRole.map(x => x.RoleId);
            res.locals.OfficerID = item.Officer[0]?.id;
            res.locals.OfficialID = item.WelfareDepartmentOfficial[0]?.id;
            res.locals.OfficialPostingID =
                item.WelfareDepartmentOfficial[0]?.WelfareDepartmentPosting[0]?.id;
            res.locals.User = item;
            res.locals.OfficeID = item.WelfareDepartmentOfficial[0]?.Office?.id;
            res.locals.DesignationID =
                item.WelfareDepartmentOfficial[0]?.WelfareDepartmentDesignation?.id;
            res.locals.DesignationRank =
                item.WelfareDepartmentOfficial[0]?.WelfareDepartmentDesignation?.Rank;
            res.locals.ControllingOffices = await getControllingOffices(
                item.id,
                res,
            );

            next();
            return true;
        }
        if (!item || item.PasswordValidFrom > iat) {
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
            Password: true,
            PasswordValidFrom: true,
            Salt: true,
            Username: true,
            ForcePasswordChange: true,
            LastLoginDateTime: true,
        };
        let condition = {
            Username: req?.body?.Username?.trim().toLowerCase(),
            IsActive: true,
            isDeleted: false,
        };
        const user = await genericGetOne({
            Table,
            condition,
            selectFields,
        });
        let check = false;

        if (req?.body?.Password) {
            req.body.Password = await decryptField(req?.body?.Password);
        }

        if (user) {
            let saltBuffer = Buffer.from(user.Salt, "base64");
            check =
                user.Password ===
                (await hashPassword(req?.body?.Password, saltBuffer));
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
                IsActive: true,
                isDeleted: false,
            };

            const token = jwt.sign(
                {
                    user: {
                        id: user.id,
                        ForcePasswordChange: user.ForcePasswordChange,
                    },
                },
                ENV.secretKey,
                {
                    expiresIn:
                        jwtExpirationTime.days * jwtExpirationTime.seconds,
                },
            );

            let includeFields = {Designation: true, Office: true};

            //TODO - Populate officer and dept official
            let officer = await genericGetOne({
                Table: "Officer",
                condition: {UserID: user.id, isDeleted: false},
                includeFields,
            });

            let deptOfficial = await genericGetOne({
                Table: "WelfareDepartmentOfficial",
                condition: {UserID: user.id, isDeleted: false},
                selectFields: {
                    id: true,
                    MobileNumber1: true,
                    Name: true,
                    MobileNumber2: true,
                    Email: true,
                    DepartmentID: true,
                    WelfareDepartmentDesignation: {
                        select: {
                            id: true,
                            Name: true,
                            Rank: true,
                        },
                    },
                    UserID: true,
                    PhotoURL: true,
                    IsVerified: true,
                    VerifiedByID: true,
                    VerifiedDate: true,
                    Office: {
                        select: {
                            id: true,
                            AreaID: true,
                            Name: true,
                            Address: true,
                            ControllingOfficerID: true,
                            OfficeTypeID: true,
                            ReportingOfficeID: true,
                            DepartmentID: true,
                        },
                    },
                },
            });

            let result = {
                token: null,
                UserId: user.id,
                Username: user.Username,
                Name: user.Name,
                Officer: officer,
                DepartmentOfficial: deptOfficial,
                LastLoginDateTime: user.LastLoginDateTime,
            };
            if (token) result.token = token;
            if (deptOfficial)
                genericUpdate({
                    Table,
                    condition,
                    json: {LastLoginDateTime: new Date()},
                    next,
                });
            if (ENV.loginLog) {
                genericCreate({
                    Table: "UserLoginLog",
                    json: {
                        Username: user.Username,
                        Result: "Success",
                        Address: requestIp.getClientIp(req),
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
                Table: "UserLoginLog",
                json: {
                    Username: req?.body?.Username?.trim().toLowerCase(),
                    Result: "Failure",
                    Address: requestIp.getClientIp(req),
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

export async function userGetOTP(req, res, next) {
    try {
        let json = req.body;
        let user = await genericGetOne({
            Table,
            condition: {
                Username: json.Username,
                IsActive: true,
                isDeleted: false,
            },
        });

        if (!user) {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_FOUND,
            });
        }
        let otp = getOTP();
        let otpJson = {
            OTP: otp,
            UserID: user.id,
            ValidUntil: getFutureTime(ENV.OTPValidMinutes),
            IsUsed: false,
            MobileNumber: user.Username,
        };

        let otpSaved = await genericCreate({
            Table: "OTP",
            json: otpJson,
            req,
            res,
        });

        if (otpSaved) {
            await sendSMS(
                user.Username,
                `Your OTP to login is:${otp}. Valid for 15 minutes`,
                next,
            );
        }

        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: otpSaved
                ? statusCodes.SUCCESS
                : statusCodes.SERVER_ERROR,
        });
    } catch (err) {
        return next(err);
    }
}

export async function verifyOtp(req, res, next) {
    try {
        const json = req.body;
        let condition = {
            IsUsed: false,
            ValidUntil: {gte: new Date()},
            MobileNumber: json.Username,
            OTP: json.OTP,
        };

        let otp = await genericGetOne({
            Table: "OTP",
            condition,
        });

        let testOtp = null;

        if (ENV.environment !== "master") {
            testOtp = {
                id: null,
                OTP: "000000",
            };
        }

        let user = null;

        if (otp) {
            await genericUpdate({
                Table: "OTP",
                condition: {id: otp.id},
                json: {IsUsed: true},
            });
            user = await genericGetOne({
                Table,
                condition: {id: otp.UserID},
                selectFields: {id: true, Username: true, Name: true},
            });
            LoginAuthenticate(req, res, true, user, next);
        } else LoginAuthenticate(req, res, false, null, next);
    } catch (error) {
        return genericResponse({
            res,
            result: null,
            exception: error,
            pagination: null,
            statusCode: statusCodes.SERVER_ERROR,
        });
    }
}

export async function userRegister(req, res, next) {
    try {
        let json = req.body;
        let userProfile = json.UserProfile;
        let user = {
            Username: json.Username.trim().toLowerCase(),
            Password: json.Password,
            ForcePasswordChange: json.ForcePasswordChange || false,
        };

        let item = await genericGetOne({
            Table,
            condition: {
                Username: user.Username,
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

        user.Salt = crypto.randomBytes(16).toString("base64");
        let saltBuffer = Buffer.from(user.Salt, "base64");

        user.Password = await hashPassword(user.Password, saltBuffer);
        user.PasswordValidFrom = moment().unix();
        user.isDeleted = false;
        user.IsActive = true;

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
        if (json.Password) {
            json.Password = await decryptField(json.Password);
        } else {
            return genericResponse({
                res,
                result: null,
                stringResult: "Password not found",
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_FOUND,
            });
        }
        if (json.NewPassword) {
            json.NewPassword = await decryptField(json.NewPassword);
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

        if (json.Password === json.NewPassword) {
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
            id: res.locals.UserID,
            IsActive: true,
            isDeleted: false,
        };
        let item = await genericGetOne({
            Table,
            condition,
        });
        if (!item) {
            return false;
        }
        let saltBuffer = Buffer.from(item.Salt, "base64");
        let isValidPassword =
            item.Password === (await hashPassword(json.Password, saltBuffer));
        if (!isValidPassword) {
            return genericResponse({
                res,
                result: null,
                stringResult: "Password does not match",
                exception: null,
                pagination: null,
                statusCode: statusCodes.NOT_FOUND,
            });
        }
        item.Salt = crypto.randomBytes(16).toString("base64");
        saltBuffer = Buffer.from(item.Salt, "base64");

        item.Password = await hashPassword(json.NewPassword, saltBuffer);
        item.PasswordValidFrom = moment().unix();
        item.ForcePasswordChange = false;

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

        item.Salt = crypto.randomBytes(16).toString("base64");
        let saltBuffer = Buffer.from(item.Salt, "base64");

        item.Password = await hashPassword(password, saltBuffer);
        item.PasswordValidFrom = moment().unix();

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
            Username: true,
            LastLoginDateTime: true,
            UserRoles: {
                select: {
                    Role: {
                        select: {
                            id: true,
                            Name: true,
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
            condition.UserProfile = {
                Name: {
                    contains: json.searchString,
                    mode: "insensitive",
                },
            };
        }
        let selectFields = {
            id: true,
            Username: true,
            LastLoginDateTime: true,
            UserRole: {
                select: {
                    Role: {
                        select: {
                            id: true,
                            Name: true,
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

async function hashPassword(Password, Salt) {
    if (Salt && Password) {
        const check = crypto
            .pbkdf2Sync(Password, Salt, 10000, 64, "sha1")
            .toString("base64");
        return check;
    }
    return Password;
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
            .flatten(user.UserRole.map(x => x.Role.APIModuleRoleAccess))
            .map(x => x.APIModule);

        const accessApi = userAccessApiModules.find(
            x => x.Route === noParamsRoute && x.Method === method,
        );

        if (!accessApi) {
            return false;
        }

        let userRoleIds = user.UserRole.map(x => x.RoleId);
        let condition = {
            APIModuleId: accessApi.id,
            RoleId: {in: userRoleIds},
        };

        const apiModuleRoleAccess = await genericGetOne({
            Table: "APIModuleRoleAccess",
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

async function getControllingOffices(userID, res) {
    try {
        const userIDgiven = userID;

        const result = await prisma.$queryRaw`WITH RECURSIVE ControllingOffices 
        AS(SELECT "id","Name" FROM "Office" WHERE "id" = ${res.locals.OfficerID}
            UNION ALL
            SELECT ofc."id",ofc."Name" FROM "Office" Ofc
            INNER JOIN ControllingOffices ctrl
            ON ofc."ReportingOfficeID" = ctrl."id"
           ) 
           SELECT * FROM ControllingOffices`;

        const ControllingOffices = [];
        result.forEach(x => {
            ControllingOffices.push(x.id);
        });
        return ControllingOffices;

        // result.forEach(x => {
        //     console.log(x.id +" " +x.Name);
        // })
    } catch (e) {
        throw new Error(e);
    }
}

export async function getAuto(req, res, next) {
    try {
        return genericResponse({
            res,
            result: "2",
            exception: null,
            pagination: null,
            statusCode: statusCodes.SUCCESS,
        });
    } catch (error) {
        return next(error);
    }
}
