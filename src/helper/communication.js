import * as ENV from "../config/environment.js";

export async function sendSMS() {
    // switch case for different providers
    if (ENV.smsLog) {
        return 1;
    }
    return true;
}

export async function sendEmail() {
    // switch case for different providers
    if (ENV.emailLog) {
        return 1;
    }
    return true;
}

export async function sendFcm() {
    // switch case for different providers
    if (ENV.fcmLog) {
        return 1;
    }
    return true;
}
