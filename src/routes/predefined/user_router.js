import express from "express";
import {
    userRegister,
    userLogin,
    userChangePassword,
    userUpdate,
    userResolver,
    getOne,
    getAll,
    getCount,
} from "../../controllers/predefined/user_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    router.put("/register", userRegister);
    router.post("/login", userLogin);
    router.post("/changepassword", userResolver, userChangePassword);
    router.patch("/:id", userUpdate);
    router.get("/:id", getOne);
    router.post("", getAll);
    router.post("/count", getCount);

    return router;
}
