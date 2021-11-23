import express from "express";

import {
    create,
    update,
    remove,
    getOne,
    getAll,
    getCount,
} from "../../controllers/predefined/ui_module_component_controller.js";
import {createServerLog} from "../../controllers/predefined/server_log_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    router.put("", createServerLog, create);
    router.patch("/:id", createServerLog, update);
    router.delete("/:id", createServerLog, remove);
    router.get("/:id", getOne);
    router.post("", getAll);
    router.post("/count", getCount);
    return router;
}
