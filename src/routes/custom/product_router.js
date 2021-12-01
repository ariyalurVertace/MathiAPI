import express from "express";

import {
    create,
    update,
    remove,
    getOne,
    getAll,
    getCount,
} from "../../controllers/custom/product_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    router.put("", create);
    router.patch("/:id", update);
    router.delete("/:id", remove);
    router.get("/:id", getOne);
    router.post("", getAll);
    router.post("/count", getCount);
    return router;
}
