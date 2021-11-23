import chalk from "chalk";

import * as ENV from "../config/environment.js";
import {getCurrentDateTime} from "../controllers/predefined/base_controller.js";

const logger = function logger(msg, type = "e") {
    if (!ENV.debug) {
        //DO NOT print logs in prod
        return;
    }

    const time = getCurrentDateTime().toLocaleTimeString();
    switch (type) {
        case "l":
            // eslint-disable-next-line no-console
            console.log(`${chalk.grey(`${time} - `)}${chalk.blue(msg)}`);
            break;
        case "e":
            // eslint-disable-next-line no-console
            console.log(`${chalk.grey(`${time} - `)}${chalk.red(msg)}`);
            break;
        case "i":
            // eslint-disable-next-line no-console
            console.log(`${chalk.grey(`${time} - `)}${chalk.green(msg)}`);
            break;
        default: {
            // eslint-disable-next-line no-console
            console.log(`${chalk.grey(`${time} - `)}${chalk.blue(msg)}`);
        }
    }
};

export default logger;
