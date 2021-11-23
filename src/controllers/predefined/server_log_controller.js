import requestIp from "request-ip";
import {genericCreate, genericUpdate} from "./generic_controller.js";
import * as ENV from "../../config/environment.js";

export async function createServerLog(req, res, next) {
    try {
        if (ENV.serverLog) {
            const clientIp = requestIp.getClientIp(req);
            let serverLog = {};
            let {params, originalUrl} = req;
            let route = originalUrl;
            if (params) {
                Object.keys(params).forEach(key => {
                    route = route.replace(params[key], `:${key}`);
                });
                serverLog.Route = route;
                serverLog.Params = JSON.stringify(params);
            }

            serverLog.Headers = JSON.stringify(req.headers);
            serverLog.RequestBody = JSON.stringify(req.body);
            serverLog.Method = req.method;
            serverLog.Url = req.originalUrl;
            serverLog.Address = clientIp;
            serverLog.RequestedDateTime = new Date();
            let createdServerLog = await genericCreate({
                Table: "ServerLog",
                json: serverLog,
            });
            req.serverLogId = createdServerLog.id;
        }
        next();
    } catch (err) {
        return false;
    }
}

export async function updateServerLog(tokens, req, res) {
    try {
        let serverLog = {};
        let responseTime = tokens["response-time"](req, res);
        serverLog.ResponseBody = res?.locals?.ResponseBody || "";
        serverLog.ResponseTime = responseTime;
        serverLog.ErrorBody = res?.locals?.ErrorBody;
        serverLog.IsError = res?.locals?.isError || false;
        serverLog.RespondedDateTime = new Date();

        genericUpdate({
            Table: "z_ServerLog",
            condition: {id: req.serverLogId},
            json: serverLog,
        });
    } catch (err) {
        return false;
    }
}
