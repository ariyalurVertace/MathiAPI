import express from "express";

import {
    create,
    update,
    remove,
    getOne,
    getAll,
    getCount,
    assignNextState,
    getNextStates,
    getAllEntityStateProgress,
} from "../../controllers/predefined/entitystate_controller.js";
import {userResolver} from "../../controllers/predefined/user_controller.js";
import {createServerLog} from "../../controllers/predefined/server_log_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    router.put("", userResolver, create);
    router.put("/next/:id", userResolver, assignNextState);
    router.post("/getnextstates", userResolver, getNextStates);
    router.patch("/:id", userResolver, update);
    router.delete("/:id", userResolver, remove);
    router.get("/:id", userResolver, getOne);
    router.post("", userResolver, getAll);
    router.post("/count", userResolver, getCount);
    router.post(
        "/entitystateprogress",

        getAllEntityStateProgress,
    );
    return router;
}
