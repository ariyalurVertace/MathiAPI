import express from "express";
import multer from "multer";

import {uploadFiles} from "../../controllers/predefined/fileupload_controller.js";
import {userResolver} from "../../controllers/predefined/user_controller.js";
import {createServerLog} from "../../controllers/predefined/server_log_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    //router.post("", uploadFiles);
    //Upload File
    router.post(
        "",
        multer({
            dest: "./Attachments/Files",
            // eslint-disable-next-line promise/prefer-await-to-callbacks
        }).any(),
        uploadFiles,
    );
    return router;
}
