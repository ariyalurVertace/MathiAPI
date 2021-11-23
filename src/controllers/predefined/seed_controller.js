import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

import * as ENV from "../../config/environment.js";

import {
    genericCreate,
    genericDelete,
    genericGetOne,
} from "./generic_controller.js";

import {genericResponse} from "./base_controller.js";
import {statusCodes, seedExpirationTimeInSecs} from "../../config/constants.js";

nacl.util = naclUtil;

const Table = "z_Seed";

export async function requestSeed(req, res, next) {
    try {
        const expiresOn = new Date();
        expiresOn.setSeconds(expiresOn.getSeconds() + seedExpirationTimeInSecs);

        // request seed node js
        const {publicKey, secretKey} = nacl.sign.keyPair();

        // save only public key in db
        const publicKeyString = nacl.util.encodeBase64(publicKey);
        //send secret key to client
        const secretKeyString = nacl.util.encodeBase64(secretKey);

        const json = {
            PublicKey: publicKeyString,
            ExpiresOn: expiresOn,
        };
        const item = await genericCreate({Table, json, req, res});
        return genericResponse({
            res,
            result: {
                _id: item._id,
                Seed: secretKeyString,
            },
            exception: null,
            pagination: null,
            statusCode: item ? statusCodes.SUCCESS : statusCodes.SERVER_ERROR,
        });
    } catch (error) {
        return next(error);
    }
}

export async function consumeSeed(id) {
    try {
        await genericDelete({
            Table,
            condition: {id},
            softDelete: false,
        });
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getSeed(id) {
    try {
        return genericGetOne({
            Table,
            condition: {id},
        });
    } catch (error) {
        return null;
    }
}

export async function decryptField(field, fieldName = "") {
    try {
        if (typeof field !== "object") {
            if (ENV.secure || ENV.prod) {
                throw new Error(`'${fieldName}' field must be encrypted`);
            }

            return field;
        }

        if (!field?.seed) {
            throw new Error("Invalid private key");
        }

        if (!field?.id) {
            throw new Error("Invalid seed id");
        }

        const seed = await getSeed(field.id);

        if (!seed?.PublicKey) {
            throw new Error("Invalid seed");
        }

        const publicKey = nacl.util.decodeBase64(seed.PublicKey);

        const decipher = nacl.sign.open(
            nacl.util.decodeBase64(field.seed),
            publicKey,
        );

        consumeSeed(field.id);

        return nacl.util.encodeUTF8(decipher);
    } catch (error) {
        throw new Error(error);
    }
}
