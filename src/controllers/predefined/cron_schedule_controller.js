/* eslint-disable no-extra-bind */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-console */
import schedule from "node-schedule";

import {genericResponse} from "./base_controller.js";
import {
    genericCreate,
    genericGetAll,
    genericGetOne,
    genericUpdate,
    genericDelete,
    genericGetCount,
} from "./generic_controller.js";
import {onCronTick} from "../custom/cron_schedule_controller.js";
import {statusCodes} from "../../config/constants.js";

const Table = "z_CronSchedule";

export async function create(req, res, next) {
    try {
        const json = req.body;
        const item = await genericCreate({Table, json, req, res});
        if (item) {
            start(item.Name, item.Rule);
        }
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
        });
        if (item) {
            start(json.Name, json.Rule);
        }
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
        let item = await genericGetOne({
            Table,
            condition: {id: parseInt(req.params.id, 10)},
        });
        let result = await genericDelete({
            Table,
            condition: {id: parseInt(req.params.id, 10)},
            softDelete: false,
            req,
            res,
        });
        if (item && result) {
            stop(item.Name);
        }
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
            condition: {id: parseInt(req.params.id, 10)},
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
        let selectFields = null;
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

export async function startAllCronSchedule() {
    const getResult = await genericGetAll({
        Table,
        pageNumber: 1,
        pageLimit: -1,
    });
    let {items} = getResult;
    for (let i = 0; i < items.length; i++) {
        start(items[i].Name, items[i].Rule);
    }
}

async function start(name, rule) {
    try {
        stop(name);
        schedule.scheduleJob(
            name,
            rule,
            function(thisCronName) {
                onCronTick(thisCronName);
            }.bind(null, name),
        );
        return true;
    } catch (e) {
        return false;
    }
}

async function stop(name) {
    try {
        let currentJob = schedule.scheduledJobs[name];
        currentJob.cancel();
        return true;
    } catch (e) {
        return false;
    }
}
