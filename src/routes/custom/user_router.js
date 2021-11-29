import express from "express";
import {
    userRegister,
    userGetOTP,
    verifyOtp,
    userLogin,
    userChangePassword,
    userUpdate,
    userResolver,
    getOne,
    getAll,
    getCount,
    getAuto,
} from "../../controllers/predefined/user_controller.js";

export default function exportedRouter() {
    const options = {
        caseSensitive: true,
    };
    const router = express.Router(options);

    router.put("/register", userRegister);
    router.post("/getotp", userGetOTP);
    router.post("/validate", verifyOtp);
    router.post("/login", userLogin);
    router.post("/changepassword", userResolver, userChangePassword);
    router.patch("/:id", userUpdate);
    router.get("/:id", getOne);
    router.post("", getAll);
    router.post("/count", getCount);

    router.get("/auto", getAuto);
    return router;
}
