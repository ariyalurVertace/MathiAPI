//import apiService from "axios";
import got from "got";

//import request from "request-promise";
import path from "path";
import fs from "fs";
//import archiver from "archiver";
import {genericResponse} from "./base_controller.js";
import {
    statusCodes,
    FILE_SIZE_LIMT,
    FILE_MIN_SIZE,
} from "../../config/constants.js";
import {uploadImageToAWS, deleteImageFromAWS} from "../../utils/aws.js";
// import {
//     consumeFileUploadRateLimiterByIp,
//     getRemainingFileUploadRateLimiterByIp,
//} from "../utils/rate_limit/file_upload";
//import {getIp} from "../utils/ip";
//import {rateLimitReached} from "../utils/rate_limit/common";
//import logger from "../utils/logger";

export function checkIfFileSizeIsUnderLimit(imagePath) {
    try {
        const stats = fs.statSync(imagePath);
        const imageSizeInKB = stats.size / 1024;
        return imageSizeInKB <= FILE_SIZE_LIMT;
    } catch (error) {
        return false;
    }
}

export function checkIfFileSizeIsOverMinLimit(imagePath) {
    try {
        const stats = fs.statSync(imagePath);
        const imageSizeInKB = stats.size / 1024;
        return imageSizeInKB >= FILE_MIN_SIZE;
    } catch (error) {
        return false;
    }
}

export async function _urlToBase64(url) {
    try {
        const response = await got(url);

        // const response = await apiService.request({
        //     method: "GET",
        //     url,
        //     responseType: "arraybuffer",
        // });
        if (!response) throw new Error("Error getting image");

        if (response.status === 200) {
            const data = `data:${
                response.headers["content-type"]
            };base64,${Buffer.from(response.data).toString("base64")}`;
            return data;
        }
        return null;
    } catch (error) {
        throw new Error(error);
    }
}

export async function urlToBase64(req, res, next) {
    try {
        const url = req?.body?.url;
        if (!url)
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                stringResult: "Invalid url",
                statusCode: statusCodes.INVALID_DATA,
            });

        const response = await _urlToBase64(url);

        return genericResponse({
            res,
            result: response,
            exception: null,
            pagination: null,
            statusCode: statusCodes.SUCCESS,
        });
    } catch (error) {
        return next(error);
    }
}

export async function uploadFiles(req, res, next) {
    try {
        const json = {};
        if (req.files.length) {
            // const remainingPoints = await getRemainingFileUploadRateLimiterByIp(
            //     getIp(req),
            // );

            // if (remainingPoints < req.files.length)
            //     return rateLimitReached(req, res, next);

            const promises = req.files.map(async file => {
                if (!checkIfFileSizeIsUnderLimit(file.path))
                    return genericResponse({
                        res,
                        result: file.fieldname,
                        exception: null,
                        pagination: null,
                        stringResult: "File too large",
                        statusCode: statusCodes.INVALID_DATA,
                    });

                if (!checkIfFileSizeIsOverMinLimit(file.path))
                    return genericResponse({
                        res,
                        result: file.fieldname,
                        exception: null,
                        pagination: null,
                        stringResult: "File too small",
                        statusCode: statusCodes.INVALID_DATA,
                    });

                const fileExtension = path.extname(file.originalname);
                if (!fileExtension)
                    return genericResponse({
                        res,
                        result: json,
                        exception: null,
                        pagination: null,
                        statusCode: statusCodes.INVALID_DATA,
                    });
                const actualFileName = file.filename;
                const uploadedFile = await uploadImageToAWS(
                    `${"files/"}${actualFileName}${fileExtension}`,
                    `${file.path}`,
                    next,
                );
                const finalUrl = uploadedFile.Location;
                json[`${file.fieldname}`] = finalUrl;
                //consumeFileUploadRateLimiterByIp(getIp(req));
                return finalUrl;
            });
            await Promise.all(promises);
        }
        return genericResponse({
            res,
            result: json,
            exception: null,
            pagination: null,
            statusCode: json ? statusCodes.SUCCESS : statusCodes.SERVER_ERROR,
        });
    } catch (error) {
        return next(error);
    }
}

export async function uploadLargeFiles(req, res, next) {
    try {
        const json = {};
        if (req.files.length) {
            // const remainingPoints = await getRemainingFileUploadRateLimiterByIp(
            //     getIp(req),
            //);

            // if (remainingPoints < req.files.length)
            //     return rateLimitReached(req, res, next);

            const promises = req.files.map(async file => {
                if (!checkIfFileSizeIsOverMinLimit(file.path))
                    return genericResponse({
                        res,
                        result: file.fieldname,
                        exception: null,
                        pagination: null,
                        stringResult: "File too small",
                        statusCode: statusCodes.INVALID_DATA,
                    });

                const fileExtension = path.extname(file.originalname);
                if (!fileExtension)
                    return genericResponse({
                        res,
                        result: json,
                        exception: null,
                        pagination: null,
                        statusCode: statusCodes.INVALID_DATA,
                    });
                const actualFileName = file.filename;
                const uploadedFile = await uploadImageToAWS(
                    `${"files/"}${actualFileName}${fileExtension}`,
                    `${file.path}`,
                    next,
                );
                const finalUrl = uploadedFile.Location;
                json[`${file.fieldname}`] = finalUrl;
                //consumeFileUploadRateLimiterByIp(getIp(req));
                return finalUrl;
            });
            await Promise.all(promises);
        }
        return genericResponse({
            res,
            result: json,
            exception: null,
            pagination: null,
            statusCode: json ? statusCodes.SUCCESS : statusCodes.SERVER_ERROR,
        });
    } catch (error) {
        return next(error);
    }
}
export async function deleteFiles(req, res, next) {
    try {
        const promises = req.body.Urls.map(async url => {
            let key = `${"files/"}${url.split(`${"files"}/`)[1]}`;
            await deleteImageFromAWS(key);
        });
        await Promise.all(promises);
        return genericResponse({
            res,
            result: null,
            exception: null,
            pagination: null,
            statusCode: statusCodes.SUCCESS,
        });
    } catch (error) {
        return next(error);
    }
}

export async function uploadExcel(filePath, actualFileName) {
    const fileExtension = ".xlsx";

    const uploadedFile = await uploadImageToAWS(
        `${"excel/"}${actualFileName}${fileExtension}`,
        filePath,
    );
    const finalUrl = uploadedFile.Location;
    return finalUrl;
}

export async function uploadTextFile(filePath, actualFileName) {
    const fileExtension = ".txt";

    const uploadedFile = await uploadImageToAWS(
        `${"txt/"}${actualFileName}${fileExtension}`,
        filePath,
    );
    const finalUrl = uploadedFile.Location;
    return finalUrl;
}

export async function uploadFile(filePath, actualFileName, extension = "") {
    const fileExtension = extension;

    const uploadedFile = await uploadImageToAWS(
        `${"csv/"}${actualFileName}${fileExtension}`,
        filePath,
        false,
    );
    const finalUrl = uploadedFile.Location;
    return finalUrl;
}

export async function uploadZip(filePath, actualFileName) {
    const fileExtension = ".zip";

    const uploadedFile = await uploadImageToAWS(
        `${"zip/"}${actualFileName}${fileExtension}`,
        filePath,
    );
    const finalUrl = uploadedFile.Location;
    return finalUrl;
}

// export async function zipFile(pathToFiles, name, nameSuffix = "") {
//     return new Promise(resolve => {
//         const zipPath = `./Attachments/${name}-${nameSuffix}.zip`;
//         const zipStream = fs.createWriteStream(zipPath);
//         const archive = archiver("zip", {
//             zlib: {level: 9}, // Sets the compression level.
//         });
//         archive.directory(`${pathToFiles}/`, false);

//         archive.pipe(zipStream);
//         archive.finalize();

//         zipStream.on("close", () => {
//             logger("Zip created", "i");
//             resolve(zipPath);
//         });

//         zipStream.on("error", err => {
//             logger("Error creating zip", "e");
//             throw err;
//         });
//     });
// }

// export async function downloadFile(url, destPath) {
//     /* Create an empty file where we can save data */
//     let file = fs.createWriteStream(destPath);
//     /* Using Promises so that we can use the ASYNC AWAIT syntax */

//     await new Promise((resolve, reject) => {
//         request({
//             /* Here you should specify the exact link to the file you are trying to download */
//             uri: url,
//             headers: {
//                 Accept:
//                     "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
//                 "Accept-Encoding": "gzip, deflate, br",
//                 "Accept-Language":
//                     "en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3",
//                 "Cache-Control": "max-age=0",
//                 Connection: "keep-alive",
//                 "Upgrade-Insecure-Requests": "1",
//                 "User-Agent":
//                     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
//             },
//             /* GZIP true for most of the websites now, disable it if you don't need it */
//             gzip: true,
//         })
//             .pipe(file)
//             .on("finish", () => {
//                 logger(`The file is finished downloading.`, "i");
//                 resolve();
//             })
//             .on("error", error => {
//                 reject(error);
//             });
//     }).catch(error => {
//         logger(`Something happened: ${error}`);
//     });
// }
