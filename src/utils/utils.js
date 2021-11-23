import {v1, v4} from "uuid";
import * as ENV from "../config/environment.js";

export function getOTP() {
    let n = getRandomNumber(ENV.SMSOTPLength);
    return String(n).padStart(ENV.SMSOTPLength, "0"); // '0009'
}
export function getFutureTime(minutes) {
    return new Date(new Date().getTime() + minutes * 60 * 1000);
}
export function getRandomNumber(length) {
    return Math.floor(Math.random() * 10 ** length); //** is power */
}

export function getUUID() {
    return v1();
}
