import moment from "moment";

import {errorCodes, localMomentOffset} from "../../config/constants.js";

export function genericResponse({
    res,
    result,
    exception,
    pagination,
    stringResult,
    statusCode,
    errors = [],
    warnings = [],
}) {
    let response = {
        result,
        exception,
        pagination,
        stringResult,
        statusCode,
        errors,
        warnings,
    };
    if (res != null || !res.headersSent) {
        res.json(response);
    }
}

export function getErrorCodeData(code = 1001) {
    return errorCodes.find(error => error.code === code);
}
export function getCurrentDateTime() {
    const indiaDate = new Date(
        moment()
            .utcOffset(localMomentOffset)
            .format(),
    );
    return indiaDate;
}

export function getCurrentUnix() {
    return moment()
        .utcOffset(localMomentOffset)
        .unix();
}

export function getCurrentUtcUnix() {
    const utcDateTime = new Date(moment.utc());
    return Math.trunc(utcDateTime.getTime() / 1000);
}

export function getCurrentMidnightUnixTime() {
    return (
        moment()
            .utcOffset(localMomentOffset)
            .startOf("days")
            .unix() * 1000
    );
}

export function getCurrentMidnightUtcUnixTime() {
    return (
        moment()
            .startOf("days")
            .unix() * 1000
    );
}

export function copyArray(arr = []) {
    return JSON.parse(JSON.stringify(arr));
}

export function copyObject(obj = {}) {
    return {...obj};
}
