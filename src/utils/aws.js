/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable no-async-promise-executor */
import fs from "fs";
import AWS from "aws-sdk";
import logger from "./logger.js";

import {imageBucketName} from "../config/environment.js";

let s3Bucket = new AWS.S3({
    params: {Bucket: imageBucketName, ACL: "public-read"},
});

let bucketParams = {Bucket: imageBucketName};
s3Bucket.createBucket(bucketParams);

export async function uploadImageToAWS(key, path, deleteSource = true) {
    return new Promise(async resolve => {
        try {
            fs.readFile(path, (err, actualFile) => {
                if (err) {
                    logger("Error uploading image: ", err);
                    throw new Error(err);
                }
                let params = {
                    Key: key,
                    Body: actualFile,
                };
                s3Bucket.upload(params, (error, uploadedFile) => {
                    // upload to AWS
                    if (!uploadedFile) {
                        logger("Error uploading image: ", error);
                        throw new Error(error);
                    }
                    if (deleteSource) fs.unlinkSync(path); // delete temp file
                    return resolve(uploadedFile);
                });
            });
        } catch (err) {
            logger("Error uploading image: ", err);
            throw new Error(err);
        }
    });
}

export async function deleteImageFromAWS(key, next) {
    return new Promise(async resolve => {
        try {
            let params = {
                Key: key,
            };
            s3Bucket.deleteObject(params, () => {
                logger("succesfully deleted image");
                return resolve(true);
            }); // delete from AWS
        } catch (err) {
            logger("Error deleting image: ", err);
            return next(err);
        }
    });
}

export async function getFilesInTimeRange() {
    return new Promise(async () => {
        const params = {
            StartAfter: "005a6dba7921167ea674df67e246ca87.jpg",
        };

        try {
            s3Bucket.listObjectsV2(params, items => {
                // upload to AWS
                logger(items);
            });
        } catch (err) {
            throw new Error(err);
        }
    });
}
