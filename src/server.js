/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import "dotenv/config.js";

import cluster from "cluster";
import {cpus} from "os";

import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import chalk from "chalk";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import greenlock from "greenlock";
import http from "http";
import spdy from "spdy";
import bodyParser from "body-parser";
import morgan from "morgan";
import mung from "express-mung";

import {genericResponse} from "./controllers/predefined/base_controller.js";
import {startAllCronSchedule} from "./controllers/predefined/cron_schedule_controller.js";
import "./controllers/predefined/redis_controller.js";
//import {initializeSocketServer} from "./controllers/predefined/socket_controller.js";
import {updateServerLog} from "./controllers/predefined/server_log_controller.js";

import router from "./routes/router.js";

//Models

import * as CONSTANTS from "./config/constants.js";

// eslint-disable-next-line import/first
import * as ENV from "./config/environment.js";
import logger from "./utils/logger.js";

nacl.util = naclUtil;

const numOfCPUs = cpus().length;
let workers = [];
const isProd = process.env.PROD === "true";
if (cluster.isMaster && isProd) {
    // Fork workers.
    for (let i = 0; i < numOfCPUs; i++) {
        workers.push(cluster.fork());

        // to receive messages from worker process
        workers[i].on("message", message => {
            // eslint-disable-next-line no-console
            console.info(message);
        });
    }

    let cronWorkerId = null;

    // process is clustered on a core and process id is assigned
    cluster.on("listening", worker => {
        // eslint-disable-next-line no-console
        console.info(`Worker ${worker.process.pid} is listening`);
        if (cronWorkerId === null) {
            // eslint-disable-next-line no-console
            console.log(`Making worker ${worker.id} as cron worker`);
            cronWorkerId = worker.id;
            worker.send({cron: true});
        }
    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on("exit", (worker, code, signal) => {
        // eslint-disable-next-line no-console
        console.warn(
            `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`,
        );

        if (worker.id === cronWorkerId) {
            // eslint-disable-next-line no-console
            console.log("Cron Worker is dead...");
            cronWorkerId = null;
        }

        const indexToRemove = workers.findIndex(x => x.id === worker.id);
        if (indexToRemove > -1) {
            workers.splice(indexToRemove, 1);
        }

        // eslint-disable-next-line no-console
        console.info("Starting a new worker");
        cluster.fork();
        workers.push(cluster.fork());
        // to receive messages from worker process
        workers[workers.length - 1].on("message", message => {
            // eslint-disable-next-line no-console
            console.info(message);
        });
    });
} else {
    // eslint-disable-next-line no-console
    console.info(`Worker ${process.pid} started`);

    const app = express();
    let httpServer = null;
    let httpsServer = null;

    if (ENV.secure) {
        //set various security headers
        app.use(
            cors({
                origin: CONSTANTS.ALLOWED_DOMAINS,
                credentials: true,
                methods: ["GET", "PUT", "POST", "PATCH", "POST", "DELETE"],
            }),
        );
        app.use(helmet());
        app.use(helmet.frameguard({action: "deny"}));
        app.use(helmet.referrerPolicy({policy: "same-origin"}));
        app.use(helmet.permittedCrossDomainPolicies());
        app.use(helmet.xssFilter());
        app.use(helmet.noSniff());
        app.use((req, res, next) => {
            res.setHeader("pragma", "no-cache");
            res.setHeader("Expires", "0");
            res.setHeader("X-Frame-Options", "deny");
            res.setHeader(
                "Cache-Control",
                "no-store, no-cache, pre-check=0, post-check=0, max-age=0, s-maxage=0",
            );
            next();
        });
    } else {
        app.use(cors());
    }

    httpServer = http.createServer(app);

    chalk.enabled = true;
    chalk.level = 3;

    app.use(
        mung.json((body, req, res) => {
            if (ENV.serverLog && req.serverLogId) {
                let responseBody = JSON.stringify(body);
                if (!res?.locals) res.locals = {};
                res.locals.ResponseBody = responseBody;
            }
            return body;
        }),
    );

    let logResponse = morgan((tokens, req, res) => {
        if (ENV.serverLog && req.serverLogId) {
            updateServerLog(tokens, req, res);
        }
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(logResponse);
    router(app);
    app.use(errorHandler);

    function errorHandler(err, req, res, next) {
        let errorMessage = err.message;

        if (!ENV.prod) {
            logger(err.stack);
        }

        if (res.headersSent) {
            return next(err);
        }

        if (!res?.locals) res.locals = {};
        res.locals.isError = true;

        let errors = [];
        const isUIError = err?.name === "UIError";
        if (isUIError) errors.push(err.message);

        let statusCode = CONSTANTS.statusCodes.SERVER_ERROR;

        if (isUIError) ({statusCode} = err);
        else if (err.message === "Forbidden")
            statusCode = CONSTANTS.statusCodes.FORBIDDEN;

        let exception = "";
        if (isUIError) exception = err.message;

        let errorBody = {
            message: err.message,
            stack: err.stack,
        };
        delete err.message;
        delete err.stack;
        errorBody = {...errorBody, ...err};
        res.locals.ErrorBody = JSON.stringify(errorBody);

        if (!isProd) {
            exception = res.locals.ErrorBody;
        }

        if (errorMessage === "P2002") {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                statusCode: CONSTANTS.statusCodes.DUPLICATE,
            });
        }
        if (errorMessage === "P2014") {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                statusCode: CONSTANTS.statusCodes.NOT_ALLOWED,
            });
        }
        return genericResponse({
            res,
            result: null,
            exception,
            stringResult: "Something went wrong!!",
            pagination: null,
            statusCode,
        });
    }

    if (ENV.httpsPort) {
        const webrootPath = "/tmp/acme-challenge";
        const configDir = "~/.config/acme";

        const tlsOptions = {
            version: "draft-11",
            server: ENV.certbotServer,
            webrootPath,
            configDir,
            email: "vasanth@vertace.com",
            approveDomains,
            agreeTos: true,
            agreeToTerms: leAgree,
            communityMember: false,
            telemetry: false,
            debug: ENV.debug,
        };

        // eslint-disable-next-line promise/prefer-await-to-callbacks
        function approveDomains(opts, certs, cb) {
            // eslint-disable-next-line promise/prefer-await-to-callbacks
            cb(null, {options: opts, certs});
        }

        function leAgree(opts, agreeCb) {
            agreeCb(null, opts.tosUrl);
        }

        const le = greenlock.create(tlsOptions);
        httpsServer = spdy.createServer(le.tlsOptions, le.middleware(app));
        httpsServer.listen(ENV.httpsPort, () => {
            let date = new Date();
            let localTime = date.getTime();
            let localOffset = date.getTimezoneOffset() * 60000;
            let utc = localTime + localOffset;
            let offset = 5.5;
            let india = utc + 3600000 * offset;
            let indiaDate = new Date(india);

            logger(`HTTPS Started at ${ENV.httpsPort} on ${indiaDate}`);
        });
        //initializeSocketServer(httpsServer);
    }

    httpServer.listen(ENV.httpPort, () => {
        let date = new Date();
        let localTime = date.getTime();
        let localOffset = date.getTimezoneOffset() * 60000;
        let utc = localTime + localOffset;
        let offset = 5.5;
        let india = utc + 3600000 * offset;
        let indiaDate = new Date(india);

        logger(`HTTP Started at ${ENV.httpPort} on ${indiaDate}`, "i");
        serverStarted();
    });
    //initializeSocketServer(httpServer);
    function serverStarted() {
        if (!isProd) {
            //startAllCronSchedule();
        }
        // Receive messages from the master process.
        process.on("message", message => {
            logger(
                `Worker ${
                    process.pid
                } received message from master. ${JSON.stringify(message)}`,
                "i",
            );
            if (message.cron === true) {
                startAllCronSchedule();
            }
        });

        process.on("SIGINT", async () => {
            try {
                logger("SIGINT signal received.");
                if (httpServer) {
                    await httpServer.close();
                    logger("HTTP Server Server stopped");
                }
                if (httpsServer) {
                    await httpsServer.close();
                    logger("HTTPS Server stopped");
                }
                process.exit(0);
            } catch (error) {
                logger(error, "e");
                process.exit(1);
            }
        });
    }
}
