import got from "got";

import {
    smsUrl,
    smsPassword,
    smsRoute,
    smsUsername,
    smsSenderId,
} from "../config/environment.js";

export default async function sendSMS(MobileNumber, Message, next) {
    try {
        let uri = smsUrl
            .replace("##to##", MobileNumber)
            .replace("##msg##", encodeURIComponent(Message));
        uri = uri
            .replace("##senderid##", smsSenderId)
            .replace("##smsUsername##", smsUsername)
            .replace("##smsPassword##", smsPassword)
            .replace("##route##", smsRoute);

        const response = await got(uri);

        if (
            response.error ||
            response.body === "Invalid Number" ||
            response.body === "Enter valid MobileNo"
        ) {
            let error = new Error(response.body);
            return next(error);
        }
        return next();
    } catch (error) {
        return next(error);
    }
}
