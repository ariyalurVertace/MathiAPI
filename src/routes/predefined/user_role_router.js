import express from "express";

import {
    create,
    remove,
    getAll,
    getCount,
} from "../../controllers/predefined/user_role_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    router.put("", create);
    router.delete("/:id", remove);
    router.post("", getAll);
    router.post("/count", getCount);
    return router;
}
