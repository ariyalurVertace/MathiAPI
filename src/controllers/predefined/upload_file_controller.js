import fs from "fs";
import {genericResponse} from "./base_controller.js";
import {
    statusCodes,
    FILE_SIZE_LIMT,
    FILE_MIN_SIZE,
    ALLOWED_MIME_TYPES_UPLOAD,
    ALLOWED_EXT_UPLOAD,
} from "../../config/constants.js";
import {getFileExtension} from "../../utils/file_upload.js";

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

export async function filterFiles(req, res, next) {
    try {
        const files = req?.files;
        let error = "";

        if (!files?.length) {
            error = "No files provided";
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                stringResult: error,
                statusCode: statusCodes.INVALID_DATA,
            });
        }

        files.forEach(file => {
            const ext = getFileExtension(file?.originalname);

            if (!ALLOWED_MIME_TYPES_UPLOAD.includes(file.mimetype)) {
                error = "Invalid file type";
            }
            if (!ALLOWED_EXT_UPLOAD.includes(ext)) {
                error = "Invalid file type";
            }
        });

        if (error) {
            return genericResponse({
                res,
                result: null,
                exception: null,
                pagination: null,
                stringResult: error,
                statusCode: statusCodes.INVALID_DATA,
            });
        }
        next();
    } catch (error) {
        return next(error);
    }
}
