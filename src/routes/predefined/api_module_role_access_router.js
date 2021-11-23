import express from "express";

import {
    grantAccess,
    getAccess,
} from "../../controllers/predefined/api_module_role_access_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    router.put("", grantAccess);
    router.get("/:id", getAccess);
    return router;
}
